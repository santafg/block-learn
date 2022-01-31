const { assert } = require("chai");

const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai").use(require("chai-as-promised")).should();

// contract("DecentralBank", (accounts) => {
// refractor accounts
contract("DecentralBank", ([owner, customer]) => {
  //  All of the code goes here for testing

  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    // Load Contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // transfer all tokens to DecentralBank (1 million)
    await rwd.transfer(decentralBank.address, tokens("1000000"));
    // transfer 100 mock tethers to investors
    // await tether.transfer(accounts[1], tokens("100"), { from: accounts[0] });
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    it("matches the name successfully", async () => {
      // let tether = await Tether.new();
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token");
    });
  });
  describe("Reward Tether Deployment", async () => {
    it("matches the name successfully", async () => {
      // let reward = await RWD.new();
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });
  describe("Decentral Bank Deployment", async () => {
    it("matches the name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "DecentralBank");
    });

    it("Conntract has right amount of  tokens ", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });
  });

  describe("Yield Farming", async () => {
    it("reward tokens for staking", async () => {
      let result;

      // Check Investor Balance

      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("100"),
        "Customer Mock wallet balance before staking "
      );

      // Approving and depositing or check staking for customer
      await tether.approve(decentralBank.address, tokens("100"), {
        from: customer,
      });
      await decentralBank.depositeTokens(tokens("100"), { from: customer });

      // Check Updated Balance of Customer after staking
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("0"),
        "Customer Mock wallet balance after staking 100 tokens "
      );

      // // Check Updated Balance of Decentral Bank
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokens("100"),
        "Decentral Bank Mock wallet balance after staking "
      );

      // // Is Staking update
      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        "true",
        "Customer staking status after staking "
      );


      // Issue Tokens 
      await decentralBank.issueTokens({from : owner});

      // Ensure only the owner can issue token 
      await decentralBank.issueTokens({from : customer}).should.be.rejected;

      // Unstake Tokens 
      await decentralBank.unstakeTokens({from : customer});

      // Check Updated Balance of Customer after Unstaking
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens("100"),
        "Customer Mock wallet balance after unstaking "
      );

      // // Check Updated Balance of Decentral Bank
      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokens("0"),
        "Decentral Bank Mock wallet balance after unstaking "
      );

      // // Is Staking update
      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        "false",
        "Customer staking status after unstaking customer no longer staking "
      );

    });
  });
});
