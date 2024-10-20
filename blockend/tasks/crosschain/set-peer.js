const { erc20Abi } = require("viem");
const { networks } = require("../../networks");
const {
  abi,
} = require("../../build/artifacts/contracts/crosschain/SkaleTester.sol/SkaleTester.json");
task("set-peer", "Set Peer").setAction(async (taskArgs) => {
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  console.log(signer.address);

  const args = [
    "40273",
    "0x000000000000000000000000B32e77dc18A4a6afDccBD58517f869A905E58Ca8",
  ];

  console.log(args);
  const crosschainTester = new ethers.Contract(
    "0x51b83a5Eb4786295F9F5B62c247287456C3E69e8",
    abi,
    signer
  );

  const response = await crosschainTester.setPeer(...args);
  const receipt = await response.wait();
  console.log(receipt);
});
