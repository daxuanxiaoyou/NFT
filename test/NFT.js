const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  require("dotenv").config();
  const web3 = require('web3')

  const { NAME, SYMBOL, BASEURI } = process.env;
  
  describe("nft test", function () {
    let bytesNull = web3.utils.asciiToHex("");
    beforeEach(async function () {
      try {
        this.owner = (await ethers.getSigners())[0];
        this.test1 = (await ethers.getSigners())[1];
        this.test2 = (await ethers.getSigners())[2];

    
        let NFT = await ethers.getContractFactory("NFT");
        this.nft = await NFT.deploy(this.owner.address, BASEURI, NAME,SYMBOL);
   
        await this.nft.deployed();
      } catch (e) {
        console.log(e);
      }
    });

    //["safeTransferFrom(address,address，uint256)"]
  
    describe("test nft contract", function () {
        describe("call safeTransferFrom (3 paras)", function () {
            it("Should mint 1 nft called by admin", async function () {
                await this.nft["safeTransferFrom(address,address,uint256)"](this.owner.address, this.test1.address, 1);
                expect(await this.nft.ownerOf(1)).equal(this.test1.address);
            });

            it("Should revert when safeTransferFrom called by other address when token not exist", async function () {
   
                try {
                    await this.nft.connect(this.test1)["safeTransferFrom(address,address,uint256)"](this.test1.address, this.owner.address, 1);
                    expect(1).equal(0);
                } catch (e) {
                    expect(e.message).contains("'ERC721: invalid token ID'")
                }
            });

            it("Should safeTransferFrom called by other address when token is owned by the address", async function () {
                await this.nft["safeTransferFrom(address,address,uint256)"](this.owner.address, this.test1.address, 1);
                expect(await this.nft.ownerOf(1)).equal(this.test1.address);
        
                await this.nft.connect(this.test1)["safeTransferFrom(address,address,uint256)"](this.test1.address, this.owner.address, 1);
                expect(await this.nft.ownerOf(1)).equal(this.owner.address);
            });
        });

        describe("call safeTransferFrom (4 paras)", function () {
            it("Should mint 1 nft called by admin", async function () {
                await this.nft["safeTransferFrom(address,address,uint256,bytes)"](this.owner.address, this.test1.address, 1, bytesNull);
                expect(await this.nft.ownerOf(1)).equal(this.test1.address);
            });

            it("Should revert when safeTransferFrom called by other address when token not exist", async function () {
   
                try {
                    await this.nft.connect(this.test1)["safeTransferFrom(address,address,uint256,bytes)"](this.test1.address, this.owner.address, 1, bytesNull);
                    expect(1).equal(0);
                } catch (e) {
                    expect(e.message).contains("'ERC721: invalid token ID'")
                }
            });

            it("Should safeTransferFrom called by other address when token is owned by the address", async function () {
                await this.nft["safeTransferFrom(address,address,uint256,bytes)"](this.owner.address, this.test1.address, 1, bytesNull);
                expect(await this.nft.ownerOf(1)).equal(this.test1.address);
        
                await this.nft.connect(this.test1)["safeTransferFrom(address,address,uint256,bytes)"](this.test1.address, this.owner.address, 1, bytesNull);
                expect(await this.nft.ownerOf(1)).equal(this.owner.address);
            });
        });

        describe("call tokenURI", function () {
            it("Should return token uri if exist", async function () {
                await this.nft["safeTransferFrom(address,address,uint256)"](this.owner.address, this.test1.address, 1);
                expect(await this.nft.ownerOf(1)).equal(this.test1.address);

                let url = await this.nft.tokenURI(1);
                expect(url).equal(BASEURI + "1");
            });

            it("Should revert when token not exist", async function () {
                try {
                    await this.nft.tokenURI(1);
                    expect(1).equal(0);
                } catch (e) {
                    expect(e.message).contains("ERC721: invalid token ID")
                }
            });
        });
    });
  });
