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
    "0x00030100210100000000000000000000000000030d4000000000000000000000000000030d40",
    "0x000301001101000000000000000000000000000186a0",
    "568706750389613301",
  ];

  console.log(args);
  const skaleTester = new ethers.Contract(
    "0xC044FCe37927A0Cb55C7e57425Fe3772181228a6",
    abi,
    signer
  );
  const response = await skaleTester.send(...args);
  const receipt = await response.wait();
  console.log(receipt);
});
