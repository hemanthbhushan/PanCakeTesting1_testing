
const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { BigNumber } = require("ethers");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");


  function convert(number) {
    return ethers.BigNumber.from(number).toNumber();
    
  }

describe("Testing", () => {
    let owner, factory, router, tokenA, tokenB,pair,masterChef,cakeToken;

    beforeEach(async () => {
        [owner,signer1,signer2] = await ethers.getSigners();
        amountA = 10000;
        amountB = 10000;

        const TokenA = await ethers.getContractFactory("TokenA");
        const TokenB = await ethers.getContractFactory("TokenB");
        const Factory = await ethers.getContractFactory("UniswapV2Factory");
        const Router = await ethers.getContractFactory("UniswapV2Router02");
        const Pair = await ethers.getContractFactory("UniswapV2Pair");
        const MasterChef = await ethers.getContractFactory("MasterChef");

        factory = await Factory.deploy(owner.address);
        await factory.deployed();

        tokenA = await TokenA.deploy();
        await tokenA.deployed();
        
        tokenB = await TokenB.deploy();
        await tokenB.deployed();

        pair = await Pair.deploy();
        await pair.deployed();
    
        router = await Router.deploy(factory.address, wETH.address);
        await router.deployed();

        masterChef = await MasterChef.deploy();
        masterChef.deployed();

        await tokenA.approve(router.address, amountA);
        await tokenB.approve(router.address, amountB);
    });
    describe("testing masterChef contract",()=>{
      it("")

    })
   

  })