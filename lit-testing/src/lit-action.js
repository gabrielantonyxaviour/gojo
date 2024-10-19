import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import {
  LitAbility,
  LitActionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import * as ethers from "ethers";
import dotnev from "dotenv";

dotnev.config();

async function main() {
  console.log("Connecting to Lit Node...");
  const litNodeClient = new LitNodeClient({
    litNetwork: LitNetwork.DatilDev,
    debug: false,
  });
  await litNodeClient.connect();
  console.log("Connected to Lit Node");
  console.log(process.env.ETHEREUM_PRIVATE_KEY);
  const ethersWallet = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY, // Replace with your private key
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
  );
  console.log("Ethereum address: ", ethersWallet.address);

  console.log("Generating session signatures....");
  const sessionSignatures = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    resourceAbilityRequests: [
      {
        resource: new LitActionResource("*"),
        ability: LitAbility.LitActionExecution,
      },
    ],
    authNeededCallback: async ({
      uri,
      expiration,
      resourceAbilityRequests,
    }) => {
      const toSign = await createSiweMessage({
        uri,
        expiration,
        resources: resourceAbilityRequests,
        walletAddress: await ethersWallet.getAddress(),
        nonce: await litNodeClient.getLatestBlockhash(),
        litNodeClient,
      });

      return await generateAuthSig({
        signer: ethersWallet,
        toSign,
      });
    },
  });
  console.log("Successfully created session signatures");
  console.log(sessionSignatures);
  const _litActionCode = async () => {
    if (magicNumber >= 42) {
      LitActions.setResponse({
        response: "The number is greater than or equal to 42!",
      });
    } else {
      LitActions.setResponse({ response: "The number is less than 42!" });
    }
  };

  const litActionCode = `(${_litActionCode.toString()})();`;
  console.log(litActionCode);

  console.log("Executing Lit Action...");
  const response = await litNodeClient.executeJs({
    sessionSigs: sessionSignatures,
    code: litActionCode,
    jsParams: {
      magicNumber: 43,
    },
  });
  console.log("Response: ", response);
  process.exit(0);
}

main();
