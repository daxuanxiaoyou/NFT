const hre = require("hardhat");
require("dotenv").config();


const { NAME, SYMBOL, ADMIN, BASEURI } = process.env;


async function main() {
  
  const nft = await deployNFT();
  console.log(
    `nft deployed to ${nft.address}`
  );
}

async function deployNFT() {
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(ADMIN, BASEURI, NAME, SYMBOL);

  await nft.deployed();
  return nft;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
