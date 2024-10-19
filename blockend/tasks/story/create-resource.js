const { networks } = require("../../networks");

const {
  abi,
} = require("../../build/artifacts/contracts/GojoIP.sol/GojoIP.json");
task("create-resource", "Create resource").setAction(async (taskArgs) => {
  const { ethers } = hre;
  const [signer] = await ethers.getSigners();
  console.log(signer.address);

  const args = [
    "0x10c019424e59d18837fd6098d583c2c3b3746497",
    "sgjfsknvlsdkfnv",
    "isbnksnvsldvndfsk",
  ];

  console.log(args);
  const gojoIp = new ethers.Contract(
    "0xbfef5DE3805a60E7dcB079B616b8096bd96d3712",
    abi,
    signer
  );
  const response = await gojoIp.createResource(...args);
  const receipt = await response.wait();
  console.log(receipt);
});
