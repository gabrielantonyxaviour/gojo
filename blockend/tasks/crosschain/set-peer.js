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
    "0x000000000000000000000000A8F191028D7319903d3F648E0f81A8E38Bb80B7D",
  ];

  console.log(args);
  const crosschainTester = new ethers.Contract(
    "0x2BB1f234D6889B0dc3cE3a4A1885AcfE1DA30936",
    abi,
    signer
  );

  const response = await crosschainTester.setPeer(...args);
  const receipt = await response.wait();
  console.log(receipt);
});
