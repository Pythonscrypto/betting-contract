# Slither Contract
### Requirements
* NodeJS 16.10.0 or later
* npm 8.2.0 or later 
* hardhat 2.8.3 or later

### Installation
* npm i

### Run tests
* npm run coverage

### Deploy contracts
* set .env file (see examples)
* npm run deploy

### Verify contracts
* npx hardhat verify --network verify 0x.deployed.contract.address 0x.wallet.address.from.env 0x.token.address.from.env

### Examples
Set .env file

**DONT USE THIS DATA!!!**
```
WALLET_ADDRESS=0xf8130f9d650BbD1c07239Ef6290ce14cC6A4B507
TOKEN_ADDRESS=0xc166e8E95592927D117D747d4b3c6cB0E60A01d1

API_KEY=T4D2UD78MRFY8E3R9DG293P6E1FAEJDK8C
PRIVATE_KEY=21dfd66b684dd553c110e1959ad892a2139a4e1a4e137cec739d29af1c0b96ec

MAINNET_URL=https://bsc-dataseed.binance.org/
```

- WALLET_ADDRES - wallet where the commission will come
- TOKEN_ADDRESS - token to be used for betting
- API_KEY - key for contract verification on [BscScan](https://bscscan.com) (you need create it in profile)
- PRIVATE_KEY - private key of the wallet from which the contract is deployed
- MAINNET_URL - JSON-RPC Endpoint [official documentation](https://docs.binance.org/smart-chain/developer/rpc.html)