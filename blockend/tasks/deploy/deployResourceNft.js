const { networks } = require("../../networks");

task("deploy-resource-nft", "Deploys the GojoResourceNft contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying GojoResourceNft contract to ${network.name}`);
    console.log("\n__Compiling Contracts__");
    await run("compile");

    const gojoResourceNftFactory = await ethers.getContractFactory(
      "GojoResourceNft"
    );

    const args = ["0x0429A2Da7884CA14E53142988D5845952fE4DF6a"];

    const gojoResourceNft = await gojoResourceNftFactory.deploy(...args);

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        gojoResourceNft.deployTransaction.hash
      } to be confirmed...`
    );

    await gojoResourceNft.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log(
      "\nDeployed GojoResourceNft contract to:",
      gojoResourceNft.address
    );

    if (network.name === "localFunctionsTestnet") {
      return;
    }

    const verifyContract = taskArgs.verify;
    if (
      network.name !== "localFunctionsTestnet" &&
      verifyContract &&
      !!networks[network.name].verifyApiKey &&
      networks[network.name].verifyApiKey !== "UNSET"
    ) {
      try {
        console.log("\nVerifying contract...");
        await run("verify:verify", {
          address: gojoResourceNft.address,
          constructorArguments: args,
        });
        console.log("Contract verified");
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log(
            "Error verifying contract.  Ensure you are waiting for enough confirmation blocks, delete the build folder and try again."
          );
          console.log(error);
        } else {
          console.log("Contract already verified");
        }
      }
    } else if (verifyContract && network.name !== "localFunctionsTestnet") {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or FUJI_SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      );
    }

    console.log(
      `\n GojoResourceNft contract deployed to ${gojoResourceNft.address} on ${network.name}`
    );
  });
