const hre = require("hardhat");
require('dotenv').config();


async function main() {
  const Betting = await hre.ethers.getContractFactory("Betting");
  const betting = await Betting.deploy(process.env.WALLET_ADDRESS, process.env.TOKEN_ADDRESS);

  console.log("Betting deployed to:", betting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
