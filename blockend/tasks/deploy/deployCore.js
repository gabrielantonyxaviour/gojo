const { networks } = require("../../networks");

task("deploy-gojo-core", "Deploys the GojoCore contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying GojoCore contract to ${network.name}`);
    console.log("\n__Compiling Contracts__");
    await run("compile");

    const gojoCoreContractFactory = await ethers.getContractFactory("GojoCore");

    const args = [
      [
        networks.skaleTestnet.endpoint,
        "0xAa25e4A9db1F3e493B9a20279572e4F15Ce6eEa2",
        "0xbE9044946343fDBf311C96Fb77b2933E2AdA8B5D",
        "0xF1D62f668340323a6533307Bb0e44600783BE5CA",
      ],
    ];

    const gojoCoreContract = await gojoCoreContractFactory.deploy(...args);

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        gojoCoreContract.deployTransaction.hash
      } to be confirmed...`
    );

    await gojoCoreContract.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log("\nDeployed GojoCore contract to:", gojoCoreContract.address);

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
          address: gojoCoreContract.address,
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
      `\n GojoCore contract deployed to ${gojoCoreContract.address} on ${network.name}`
    );
  });
