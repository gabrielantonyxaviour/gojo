const { erc20Abi } = require("viem");
const { networks } = require("../../networks");

task("approve-skale", "Approve SKALE").setAction(async (taskArgs) => {
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  console.log(signer.address);

  const args = [
    "0xB32e77dc18A4a6afDccBD58517f869A905E58Ca8",
    "10000000000000000000",
  ];

  console.log(args);
  const skaleToken = new ethers.Contract(
    "0x6c71319b1F910Cf989AD386CcD4f8CC8573027aB",
    erc20Abi,
    signer
  );
  const response = await skaleToken.approve(...args);
  const receipt = await response.wait();
  console.log(receipt);
});
