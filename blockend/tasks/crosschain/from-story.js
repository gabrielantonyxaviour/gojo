const { erc20Abi } = require("viem");
const { networks } = require("../../networks");
const {
  abi,
} = require("../../build/artifacts/contracts/crosschain/StoryTester.sol/StoryTester.json");
task("from-story", "From Styor").setAction(async (taskArgs) => {
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  console.log(signer.address);

  const args = [
    "Hello! This is Story.",
    "0x00030100210100000000000000000000000000030d40000000000000000007c5d79659b25005",
    "0x00030100110100000000000000000000000000030d40",
  ];

  console.log(args);
  const storyTester = new ethers.Contract(
    "0x582384603173D650D634c52dD37771cFE439A888",
    abi,
    signer
  );
  const response = await storyTester.send(...args, {
    value: 699868448409019115n,
  });
  const receipt = await response.wait();
  console.log(receipt);
});
