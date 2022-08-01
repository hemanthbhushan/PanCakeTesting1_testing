
const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { BigNumber } = require("ethers");


  function convert(number) {
    return ethers.BigNumber.from(number).toNumber();
    
  }
  function expandTo18Decimals(n) {
    return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
  }

describe("Testing", () => {
    let owner, factory, router, tokenA, tokenB, wETH,Pair,pair,liquidityToken;

    beforeEach(async () => {
        [owner,signer1,signer2] = await ethers.getSigners();
        amountA = 10000;
        amountB = 10000;

        const TokenA = await ethers.getContractFactory("TokenA");
        const TokenB = await ethers.getContractFactory("TokenB");
        const TokenC = await ethers.getContractFactory("TokenC");
        const TokenD = await ethers.getContractFactory("TokenD");
        const WETH = await ethers.getContractFactory("WETH");
        const Factory = await ethers.getContractFactory("UniswapV2Factory");
        const TaxableToken = await ethers.getContractFactory("DeflatingERC20");
        Pair = await ethers.getContractFactory("UniswapV2Pair");
        const LiquidityToken = await ethers.getContractFactory("UniswapV2ERC20");

        factory = await Factory.deploy(owner.address);
        await factory.deployed();
        tokenA = await TokenA.deploy();
        await tokenA.deployed();
        tokenB = await TokenB.deploy();
        await tokenB.deployed();

        tokenC = await TokenC.deploy();
        await tokenC.deployed();
        tokenD = await TokenD.deploy();
        await tokenD.deployed();
        wETH = await WETH.deploy();
        await wETH.deployed();

        taxableToken = await TaxableToken.deploy(1000000000000000);
        await taxableToken.deployed();

        pair = await Pair.deploy();
        await pair.deployed();
        liquidityToken = await LiquidityToken.deploy();
        liquidityToken.deployed();

        await tokenA.mintToken(signer1.address,10000);
        await tokenB.mintToken(signer1.address,10000);

       

        const Router = await ethers.getContractFactory("UniswapV2Router02");
        router = await Router.deploy(factory.address, wETH.address);
        await router.deployed();

        await tokenA.approve(router.address, amountA);
        await tokenB.approve(router.address, amountB);
    });
    
  })