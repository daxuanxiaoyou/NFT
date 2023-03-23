require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();


const { API_URL, ACCOUNT_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;


module.exports = {
    defaultNetwork: "hardhat",
    solidity: "0.8.7",
    networks: {
      localhost: {
        allowUnlimitedContractSize: true,
        blockGasLimit: 10000000000,
        gas: 100000000,
      },
      matic: {
        url: API_URL,
        accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
      },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    solidity: {
        compilers: [
          {
            version: "0.8.7",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200,
              },
            },
          },
        ],
    },
    contractSizer: {
      alphaSort: true,
      runOnCompile: true,
      disambiguatePaths: true
    }
  };
