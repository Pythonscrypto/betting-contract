const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Betting contract tests", async () => {
  let Betting;
  let betting;

  let owner;
  let address1;
  let address2;

  let catchRevert = require("./helpers/exeptions").catchRevert;

  beforeEach(async () => {
    TestCoin = await ethers.getContractFactory("TestCoin");
    Betting = await ethers.getContractFactory("Betting");
    [owner, address1, address2] = await ethers.getSigners();

    testCoin = await TestCoin.deploy(BigNumber.from(10_000_000_000));
    betting = await Betting.deploy(owner.address, testCoin.address);
  });

  it("Player should be able to place a bet", async () => {
    const bet = 10_000;

    await testCoin.connect(address1).mint(100_000);
    await testCoin.connect(address1).approve(betting.address, bet);

    const balanceBefore = await testCoin.balanceOf(address1.address);

    await betting.connect(address1).newBet(bet);

    const balanceAfter = await testCoin.balanceOf(address1.address);

    expect(balanceAfter).to.equal(balanceBefore - bet);
    expect(await betting.playersCount()).to.equal(1);
  });

  it("Player cannot place a bet equal to zero or less", async () => {
    const bet = 0;

    await testCoin.connect(address1).mint(100_000);
    await testCoin.connect(address1).approve(betting.address, bet);

    await catchRevert(betting.connect(address1).newBet(bet));
    expect(await betting.playersCount()).to.equal(0);
  });

  it("This case testing playerKilled function and calculation awards/bets", async () => {
    const bet1 = 10_000;
    const bet2 = 5_000;

    await testCoin.connect(address1).mint(100_000);
    await testCoin.connect(address2).mint(100_000);

    await testCoin.connect(address1).approve(betting.address, bet1);
    await testCoin.connect(address2).approve(betting.address, bet2);

    await betting.connect(address1).newBet(bet1);
    await betting.connect(address2).newBet(bet2);

    await betting.playerKilled(address1.address, address2.address);

    expect(await betting.rewards(address1.address)).to.equal(bet2);
    expect(await betting.rewards(address2.address)).to.equal(0);
    expect(await betting.bets(address2.address)).to.equal(0);
    expect(await betting.isPlayerInGame(address2.address)).to.equal(false);
    expect(await betting.playersCount()).to.equal(1);
  });

  it("Player should be able to claim reward", async () => {
    const mintSupply = 100_000;

    const bet1 = 10_000;
    const bet2 = 5_000;

    await testCoin.connect(address1).mint(mintSupply);
    await testCoin.connect(address2).mint(mintSupply);

    await testCoin.connect(address1).approve(betting.address, bet1);
    await testCoin.connect(address2).approve(betting.address, bet2);

    await betting.connect(address1).newBet(bet1);
    await betting.connect(address2).newBet(bet2);

    await betting.playerKilled(address2.address, address1.address);

    await betting.connect(address2).claimRewards();

    const balance = await testCoin.balanceOf(address2.address);

    expect(balance).to.equal((mintSupply - bet2) + (bet2 + (bet1 / 2)) * 0.8);
  });

  it('Comission should be send', async () => {
    const mintSupply = 100_000;

    const bet1 = 10_000;
    const bet2 = 5_000;

    await testCoin.connect(address1).mint(mintSupply);
    await testCoin.connect(address2).mint(mintSupply);

    await testCoin.connect(address1).approve(betting.address, bet1);
    await testCoin.connect(address2).approve(betting.address, bet2);

    await betting.connect(address1).newBet(bet1);
    await betting.connect(address2).newBet(bet2);

    await betting.playerKilled(address2.address, address1.address);

    await betting.connect(address2).claimRewards();

    const balanceOfComissionWallet = await testCoin.balanceOf(owner.address);

    expect(balanceOfComissionWallet).to.equal(bet2 * 2 * 0.2);
  })
});
