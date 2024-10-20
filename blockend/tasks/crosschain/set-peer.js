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
    "40315",
    "0x000000000000000000000000C3E60b8424274d30ec4e7D1f34C6b592fB1D9FC5",
  ];

  console.log(args);
  const crosschainTester = new ethers.Contract(
    "0xBbc7268f991b6325Ab733f7250da42243900C71a",
    abi,
    signer
  );
  const response = await crosschainTester.setPeer(...args);
  const receipt = await response.wait();
  console.log(receipt);
});
