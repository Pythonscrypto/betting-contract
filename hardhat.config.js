require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    testnet: {
      url: process.env.TESTNET_URL,
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY]
   },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.API_KEY,
    }
  }
};
