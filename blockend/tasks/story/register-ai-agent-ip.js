const { networks } = require("../../networks");

const {
  abi,
} = require("../../build/artifacts/contracts/GojoIP.sol/GojoIP.json");
task("register-ai", "Register AI Agent resource").setAction(
  async (taskArgs) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();
    console.log(signer.address);

    const args = ["sknvkdjsnvkjdsnvsd", "vnksvnselkndkjncskl"];

    console.log(args);
    const gojoIp = new ethers.Contract(
      networks.storyTestnet.gojoIpWithRegsiter,
      abi,
      signer
    );
    const response = await gojoIp.registerAiAgentIp(...args, {
      gasLimit: 1000000,
    });
    const receipt = await response.wait();
    console.log(receipt);
  }
);
