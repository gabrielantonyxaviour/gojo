const { networks } = require("../../networks");

task("deploy-story-wrapper", "Deploys the GojoStoryUsdWrapper contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying GojoStoryUsdWrapper contract to ${network.name}`);
    console.log("\n__Compiling Contracts__");
    await run("compile");

    const gojoStoryUsdWrapperContractFactory = await ethers.getContractFactory(
      "GojoStoryUsdWrapper"
    );

    const args = [networks.storyTestnet.endpoint];

    const gojoStoryUsdWrapperContract =
      await gojoStoryUsdWrapperContractFactory.deploy(...args);

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        gojoStoryUsdWrapperContract.deployTransaction.hash
      } to be confirmed...`
    );

    await gojoStoryUsdWrapperContract.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log(
      "\nDeployed GojoStoryUsdWrapper contract to:",
      gojoStoryUsdWrapperContract.address
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
          address: gojoStoryUsdWrapperContract.address,
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
      `\n GojoStoryUsdWrapper contract deployed to ${gojoStoryUsdWrapperContract.address} on ${network.name}`
    );
  });
