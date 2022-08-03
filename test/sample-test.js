
const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { BigNumber } = require("ethers");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");



describe("Testing", () => {
    let owner, factory, router,signer1,signer2, devAdd,tokenA, tokenB,pair,masterChef,cakeToken,syrupToken,chef;

    beforeEach(async () => {
        [owner,signer1,signer2,devAdd,cakeToken,syrupToken] = await ethers.getSigners();
        const Cake = await ethers.getContractFactory("CakeToken");
        const Syrup = await ethers.getContractFactory("SyrupBar");
        const MockBEB20 = await ethers.getContractFactory("MockBEP20");
        const MasterChef = await ethers.getContractFactory("MasterChef");

        lp1 = await MockBEB20.deploy("lpToken1","LP1",100000);
        lp2 = await MockBEB20.deploy("lpToken2","LP2",100000);
        lp3 = await MockBEB20.deploy("lpToken3","LP3",100000);

        await lp1.transfer(signer1.address,1000);
        await lp2.transfer(signer1.address,1000);
        await lp3.transfer(signer1.address,1000);

        await lp1.transfer(signer2.address,1000);
        await lp2.transfer(signer2.address,1000);
        await lp3.transfer(signer2.address,1000);


        cakeToken = await Cake.deploy();
        cakeToken.deployed();
        syrupToken = await Syrup.deploy(cakeToken.address);
        syrupToken.deployed();
        chef = await MasterChef.deploy(cakeToken.address,syrupToken.address,devAdd.address,1000,10);

       await cakeToken.transferOwnership(chef.address);
       await syrupToken.transferOwnership(chef.address);
        
        
    });
    describe("testing masterChef contract",()=>{
      it("checking the pool length ",async ()=>{
         await chef.add(1000,lp1.address,true);
         await chef.add(1000,lp2.address,true);
         await chef.add(1000,lp3.address,true);
         
         await lp1.connect(signer1).approve(chef.address,100);
         await lp2.connect(signer1).approve(chef.address,100);
         await lp3.connect(signer1).approve(chef.address,100);

         await lp1.connect(signer2).approve(chef.address,100);
         await lp2.connect(signer2).approve(chef.address,100);
         await lp3.connect(signer2).approve(chef.address,100);

         await chef.connect(signer1).deposit(1,10);
         await chef.connect(signer1).deposit(1,60);
         await chef.connect(signer1).deposit(2,10);

         await chef.connect(signer2).deposit(2,60);
         await chef.connect(signer2).deposit(2,10);
         await chef.connect(signer2).deposit(3,60);

         

         const user1balance1 = await lp1.balanceOf(signer1.address);
         const user1balance2 = await lp2.balanceOf(signer1.address);
         const user1balance3 = await lp3.balanceOf(signer1.address);

         const user2balance1 = await lp1.balanceOf(signer2.address);
         const user2balance2 = await lp2.balanceOf(signer2.address);
         const user2balance3 = await lp3.balanceOf(signer2.address);


         const balanceOfChef1 = await lp1.balanceOf(chef.address);
         const balanceOfChef2 = await lp2.balanceOf(chef.address);
         const balanceOfChef3 = await lp3.balanceOf(chef.address);

         console.log(`balance of signer1 lp1 ${Number(user1balance1)}, balance of signer2 lp1 ${Number(user2balance1)}  ,balance of the chefContract1 ${Number(balanceOfChef1)}`)
         console.log(`balance of signer1 lp2 ${Number(user1balance2)},  balance of signer2 lp1 ${Number(user2balance2)}   , balance of the chefContract2 ${Number(balanceOfChef2)}`)

         console.log(`balance of signer1 lp3 ${Number(user1balance3)},   balance of signer2 lp1 ${Number(user2balance3)}   ,balance of the chefContract3 ${Number(balanceOfChef3)}`)
         
         expect(user1balance1).to.equal(930);
         expect(user1balance2).to.equal(990);
         expect(user1balance3).to.equal(1000);

         expect(user2balance1).to.equal(1000);
         expect(user2balance2).to.equal(930);
         expect(user2balance3).to.equal(940);

         expect(balanceOfChef1).to.equal(70);
         expect(balanceOfChef2).to.equal(80);
         expect(balanceOfChef3).to.equal(60);



         await chef.connect(signer1).withdraw(1,10);
         await chef.connect(signer1).withdraw(2,10);

         await chef.connect(signer2).withdraw(2,70);
         await chef.connect(signer2).withdraw(3,60);

         const afteruser2balance1 = await lp1.balanceOf(signer2.address);
         const afteruser2balance2 = await lp2.balanceOf(signer2.address);
         const afteruser2balance3 = await lp3.balanceOf(signer2.address);

         expect(afteruser2balance1).to.equal(1000);
         expect(afteruser2balance2).to.equal(1000);
         expect(afteruser2balance3).to.equal(1000);

         const cakeBalanceUser1 = await cakeToken.balanceOf(signer1.address);
        const cakeBalanceUser2 = await cakeToken.balanceOf(signer2.address);

        const developer = await cakeToken.balanceOf(devAdd.address);

        console.log(`cake balance of the user one  ${Number(cakeBalanceUser1)}, user two  ${Number(cakeBalanceUser1)}`)

        console.log("developer cake reward",Number(developer));

        expect(await chef.poolLength()).to.equal(4);



      })
      it("checking the enter staking function",async ()=>{
          
        await chef.add(1000,lp1.address,true);
        await chef.add(1000,lp2.address,true);
        await chef.add(1000,lp3.address,true);


        await lp1.connect(signer1).approve(chef.address,1000);

        await chef.connect(signer1).deposit(1,500);
        await chef.connect(signer1).withdraw(1,500);


        const userCakeBalance = await cakeToken.balanceOf(signer1.address);

        console.log("user cake balance ====",Number(userCakeBalance));

        await cakeToken.connect(signer1).approve(chef.address,250);

        await chef.connect(signer1).enterStaking(250);

        const ckaeInChef = await cakeToken.balanceOf(chef.address);
        console.log("chef cake balance ====",Number(ckaeInChef));
        expect(ckaeInChef).to.equal(250);

        await chef.connect(signer1).leaveStaking(250);

        const balanceOfAfterLeavingStaking = await cakeToken.balanceOf(signer1.address);

        console.log("balance Of After Leaving Staking",Number(balanceOfAfterLeavingStaking));

        expect(balanceOfAfterLeavingStaking).to.equal(500);
})
it("emergency withdraw",async ()=>{
  await chef.add(1000,lp1.address,true);
  

  await lp1.connect(signer1).approve(chef.address,200);
  await chef.connect(signer1).deposit(1,200);
  await chef.connect(signer1).emergencyWithdraw(1);

  const signer1Balance = await lp1.balanceOf(signer1.address);
  const cakeBalance  = await cakeToken.balanceOf(signer1.address);
  
  expect(signer1Balance).to.equal(1000);
  expect(cakeBalance).to.equal(0);


})

    })
   

  })

   