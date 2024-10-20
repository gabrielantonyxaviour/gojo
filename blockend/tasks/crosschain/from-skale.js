const { erc20Abi } = require("viem");
const { networks } = require("../../networks");
const {
  abi,
} = require("../../build/artifacts/contracts/crosschain/SkaleTester.sol/SkaleTester.json");
task("from-skale", "From SKALE").setAction(async (taskArgs) => {
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  console.log(signer.address);

  const args = [
    "Hello! This is SKALE.",
    "0x00030100210100000000000000000000000000030d40000000000000000007e95e88c9735005",
    "0x00030100110100000000000000000000000000030d40",
    "1282755647931744430",
  ];

  console.log(args);
  const skaleTester = new ethers.Contract(
    "0xB32e77dc18A4a6afDccBD58517f869A905E58Ca8",
    abi,
    signer
  );
  const response = await skaleTester.send(...args);
  const receipt = await response.wait();
  console.log(receipt);
});
