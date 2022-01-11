pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Betting is Ownable { 
  using SafeERC20 for IERC20;

  IERC20 private scaleToken;

  address payable wallet;

  mapping (address => uint) private bets;
  mapping (address => uint) private rewards;

  uint private playersCount;

  event BetPlaced(address sender, uint amount);
  event AwardRecieved(address reciever, uint amount);
  event PLayerKilled(address killer, address victim);

  constructor(address payable walletAddress, address scaleTokenAddress) {
    require(walletAddress != address(0));
    require(scaleTokenAddress != address(0));
    playersCount = 0;
    wallet = walletAddress;
    scaleToken = IERC20(scaleTokenAddress);
  }

  function newBet(uint amount) public {
    require(amount > 0, "Bet must be greather zero.");

    scaleToken.safeTransferFrom(msg.sender, address(this), amount);    
    bets[msg.sender] = amount; 
    playersCount++;

    emit BetPlaced(msg.sender, amount);
  }

  function claimRewards() external {
    address player = msg.sender;

    uint reward = rewards[player] + bets[player];
    uint comission = reward * 20 / 100;
    
    scaleToken.safeTransfer(player, reward - comission);
    scaleToken.safeTransfer(wallet, comission);
    
    rewards[player] = 0;
    bets[player] = 0;

    emit AwardRecieved(player, reward);
  } 

  function playerKilled(address killer, address victim) external onlyOwner {
    require(isPlayerInGame(killer), "Killer is not a player.");
    require(isPlayerInGame(victim), "Victim is not a player.");

    uint reward = 0;
    uint refund = 0;

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
    return bets[player] == 0 ? false : true;
  } 

  function getBetsByUser(address playerAddress) external view returns(uint) {
    return bets[playerAddress];
  }

  function getCurrentRewardByUser(address playerAddress) external view returns(uint) {
    return rewards[playerAddress];
  }

  function getPlayersCount() external view returns(uint) {
    return playersCount;
  }
}
