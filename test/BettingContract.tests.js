const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Betting contract tests", async function() {
    let Betting;
    let betting;

    let owner;
    let address1;
    let address2;

    beforeEach(async function() {
        TestCoin = await ethers.getContractFactory("TestCoin");
        Betting = await ethers.getContractFactory("Betting");
        [owner, address1, address2] = await ethers.getSigners();

        testCoin = await TestCoin.deploy(BigNumber.from(10_000_000_000));
        betting = await Betting.deploy(owner.address, testCoin.address);

        
    });

    it("Player can place a bet", async function() {
        const bet = 10_000;

        await testCoin.connect(address1).mint(100_000);
        await testCoin.connect(address1).approve(betting.address, bet);

        const balanceBefore = await testCoin.balanceOf(address1.address);
        console.log(balanceBefore);

        await betting.connect(address1).newBet(bet);
        
        const balanceAfter = await testCoin.balanceOf(address1.address);
        console.log(balanceAfter);

        await betting.getBetsByUser(owner.address);
        expect(balanceAfter).to.equal(balanceBefore - bet);
    });

    it("", async function() {
        
    });
});