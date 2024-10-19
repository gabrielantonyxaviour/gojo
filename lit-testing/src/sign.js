import ethers from "ethers";
import { LIT_RPC } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import dotnev from "dotenv";

dotnev.config();

async function main() {
  try {
    const ethersSigner = new ethers.Wallet(
      process.env.ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    const litNodeClient = new LitNodeClient({
      litNetwork: LitNetwork.DatilTest,
      debug: false,
    });
    console.log("Connecting LitNodeClient to Lit network...");
    await litNodeClient.connect();
    console.log("Connected LitNodeClient to Lit network");
    const chain = "ethereum";
    const sessionSigs = {
      "https://147.135.61.242:443": {
        sig: "d09fa644ce0632203e99d7ec50e06b52ce22fbdb16040737e05a2764747b6f0b08868764d5a43a47f4eb8c4a0e956edf43cf18f53778a1721d4875bd06f2760c",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://147.135.61.242:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
      "https://158.69.163.138:443": {
        sig: "e09d2cab2228d9d5ddef8b6f37ef49be8c5247346ef8d6d5cfc55fe6da4f77f77bc07a1a1e5f4cc238001b1317d24e5651fca2d8c3e82fb3fc572c29f266a706",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://158.69.163.138:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
      "https://158.69.108.66:443": {
        sig: "45fe34c7e8066021f0ccadc9245913890d41cd2b3abb6b45261aedf3fef133dd96c5dd2278612e0c529ff15cc9e8a1ab636f39f135d28410849fc9a05e1fb00d",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://158.69.108.66:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
      "https://51.255.59.58:443": {
        sig: "75140bf20afbfe1b82bd761c79b33d3fd110fa7296a3c4d00bc1150c080535ccebd3c1e49357d373d0a98a87d4bca61a953b9cc776806cd0dda965bdfb565c06",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://51.255.59.58:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
      "https://167.114.17.201:443": {
        sig: "0180f78a0ff7020c62789e03667ed28b740e4c654b423d0af2ebe6d7ccf0a4e46cde09a4878f9b9e97e0aec4487941c71fbdef6cf32df2356878e7e7c187d705",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://167.114.17.201:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
      "https://167.114.17.202:443": {
        sig: "c1cb7ff1803a4bebcb7f807fc208b1307d480144294cc1ec50e4056cbf1cc21f0bc5ae55cc4e67ff53892c89dc0d83754280bf6f5b0c898aa836b2b457bdec0f",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://167.114.17.202:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
      "https://207.244.72.175:443": {
        sig: "1f9bf6d878711102619b9648f19257a49609f46edfc303884d325d01beb3e9ca3f99515afddef95430e41136172bed8896178f86efa3f4babff552534fbc980f",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://207.244.72.175:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
      "https://199.115.117.115:443": {
        sig: "120984b7eab6ab16c571de1e4c9df6e21a17a7940bdc201b55b427ff6443a28e0fcdcf014d813f1ed9aed9428ee1942251d644e4130c6a308dba9d014b0c1902",
        derivedVia: "litSessionSignViaNacl",
        signedMessage: `{"sessionKey":"356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-accesscontrolcondition"},"ability":"access-control-condition-decryption"}],"capabilities":[{"sig":"0x58a0aeab5bd2a2a60a3ae9740d1403a67472a6a464834d20656f447f513ae9a833555868046f2dc01da3cc0ed2c580ae6a26b07c0d5a71527218066b16f22db01b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Auth': 'Auth' for 'lit-ratelimitincrease://25154'.\\n\\nURI: lit:capability:delegation\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:20.985Z\\nExpiration Time: 2024-10-25T21:27:20.982Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LXJhdGVsaW1pdGluY3JlYXNlOi8vMjUxNTQiOnsiQXV0aC9BdXRoIjpbeyJkZWxlZ2F0ZV90byI6WyIwNDI5QTJEYTc4ODRDQTE0RTUzMTQyOTg4RDU4NDU5NTJmRTRERjZhIl0sIm5mdF9pZCI6WyIyNTE1NCJdLCJ1c2VzIjoiMSJ9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"},{"sig":"0x4c5d7ac51b4008062b4bcbf144fbbcb6b976a0887c9bcd6b49766c010070c1b31f411abe178add81530044862e8da970158440b73ca09a4c5a7fe3d4f8ec13101b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0x0429A2Da7884CA14E53142988D5845952fE4DF6a\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) 'Threshold': 'Decryption', 'Signing' for 'lit-accesscontrolcondition://*'.\\n\\nURI: lit:session:356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594\\nVersion: 1\\nChain ID: 1\\nNonce: 0x394b6f267b79dfc302440edbe23db3b404caccce2b9d570a8257348ce3d90ad6\\nIssued At: 2024-10-18T21:27:21.008Z\\nExpiration Time: 2024-10-19T05:47:20.990Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dLCJUaHJlc2hvbGQvU2lnbmluZyI6W3t9XX19LCJwcmYiOltdfQ","address":"0x0429A2Da7884CA14E53142988D5845952fE4DF6a"}],"issuedAt":"2024-10-18T21:27:21.019Z","expiration":"2024-10-19T05:47:20.990Z","nodeAddress":"https://199.115.117.115:443"}`,
        address:
          "356fcf75edd0c5048e8478b295863fa00f74fdc1d2e26aae6d71f2a31597c594",
        algo: "ed25519",
      },
    };
    var unifiedAccessControlConditions = [
      {
        conditionType: "evmBasic",
        contractAddress: "",
        standardContractType: "",
        chain,
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "0",
        },
      },
    ];

    console.log("Encrypting Data...");
    const { ciphertext, dataToEncryptHash } =
      await LitJsSdk.zipAndEncryptString(
        {
          unifiedAccessControlConditions,
          chain,
          sessionSigs,
          dataToEncrypt: "this is a secret message",
        },
        litNodeClient
      );
    console.log("Data Encrypted Successfully");

    console.log("Decrypting Data...");
    const decryptedFiles = await LitJsSdk.decryptToZip(
      {
        unifiedAccessControlConditions,
        chain,
        sessionSigs,
        ciphertext,
        dataToEncryptHash,
      },
      litNodeClient
    );
    const decryptedString = await decryptedFiles["string.txt"].async("text");
    console.log("decrypted string", decryptedString);
    return jwt;
  } catch (e) {
    return e;
  }
}

main()
  .then((res) => {
    console.log(res);
    return 0;
  })
  .catch((err) => {
    if (err) console.error(err);
    return 1;
  });
