pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestCoin is ERC20 {
    uint256 currentSupply;
    
    constructor(uint256 _initialSupply) ERC20("TestCoin", "TC") { 
        currentSupply = _initialSupply;
    }

    function mint(uint256 amount) external {
        require(currentSupply > 0);
        _mint(msg.sender, amount);
        currentSupply -= amount;
    }
}