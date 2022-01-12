pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Betting is Ownable { 
  using SafeERC20 for IERC20;

  IERC20 private scaleToken;

  address payable wallet;

  mapping (address => uint256) private bets;
  mapping (address => uint256) private rewards;

  uint256 private playersCount;
  uint256 public taxRate = 2000;
  uint256 public constant PCT_BASE = 10000;

  event BetPlaced(address sender, uint256 amount);
  event AwardReceived(address receiver, uint256 amount);
  event PLayerKilled(address killer, address victim);

  constructor(address payable walletAddress, address scaleTokenAddress) {
    require(walletAddress != address(0));
    require(scaleTokenAddress != address(0));

    playersCount = 0;
    wallet = walletAddress;
    scaleToken = IERC20(scaleTokenAddress);
  }

  function newBet(uint256 amount) public {
    require(amount > 0, "Bet must be greather zero.");

    scaleToken.safeTransferFrom(msg.sender, address(this), amount);    
    bets[msg.sender] = amount; 
    playersCount++;

    emit BetPlaced(msg.sender, amount);
  }

  function claimRewards() external {
    address player = msg.sender;

    uint256 reward = rewards[player] + bets[player];
    uint256 comission = reward * taxRate / PCT_BASE;
    
    scaleToken.safeTransfer(player, reward - comission);
    scaleToken.safeTransfer(wallet, comission);
    
    rewards[player] = 0;
    bets[player] = 0;

    emit AwardReceived(player, reward);
  } 

  function playerKilled(address killer, address victim) external onlyOwner {
    require(isPlayerInGame(killer), "Killer is not a player.");
    require(isPlayerInGame(victim), "Victim is not a player.");

    uint256 reward = 0;
    uint256 refund = 0;

    if (bets[victim] < bets[killer]) {
      reward = bets[victim];
    } else {
      reward = bets[killer];
      refund = bets[victim] - bets[killer];
    }

    bets[victim] = 0;
    rewards[killer] = reward;
    playersCount--;

    if (refund > 0) {
      scaleToken.safeTransfer(victim, refund);
    }
    
    emit PLayerKilled(killer, victim);
  }

  function isPlayerInGame(address player) public view returns(bool) {
    return bets[player] > 0;
  } 

  function getBetsByUser(address playerAddress) external view returns(uint256) {
    return bets[playerAddress];
  }

  function getCurrentRewardByUser(address playerAddress) external view returns(uint256) {
    return rewards[playerAddress];
  }

  function getPlayersCount() external view returns(uint256) {
    return playersCount;
  }
}
