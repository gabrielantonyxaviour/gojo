const { networks } = require("../../networks");

task("deploy-story-core", "Deploys the GojoStoryCore contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying GojoStoryCore contract to ${network.name}`);
    console.log("\n__Compiling Contracts__");
    await run("compile");

    const gojoStoryCoreContractFactory = await ethers.getContractFactory(
      "GojoStoryCore"
    );

    const args = [
      networks.storyTestnet.endpoint,
      "0xbE9044946343fDBf311C96Fb77b2933E2AdA8B5D",
      "",
    ];

    const gojoStoryCoreContract = await gojoStoryCoreContractFactory.deploy(
      ...args
    );

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        gojoStoryCoreContract.deployTransaction.hash
      } to be confirmed...`
    );

    await gojoStoryCoreContract.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log(
      "\nDeployed GojoStoryCore contract to:",
      gojoStoryCoreContract.address
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
          address: gojoStoryCoreContract.address,
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
      `\n GojoStoryCore contract deployed to ${gojoStoryCoreContract.address} on ${network.name}`
    );
  });
