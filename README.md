# Gojo

No code solution for "ANYONE" to build a web3 prototype in less than 10 minutes

## Description

Gojo is a intuitive AI tool that simplies the process of building and testing MVPs, without writing a single line of code in a decentralized manner. The platform leverages **AI agents** to handle the complex technical work, so users can simply describe their idea with a prompt, and Gojo takes care of the rest.

Many people in the web3 space have innovative ideas but lack the technical skills to bring them to life. Even experienced developers sometimes struggle to keep up with the rapid evolution of new web3 technologies. Gojo solves both problems by using powerful AI agents to build web3 projects based on user input. This eliminates the need for in-depth programming knowledge and drastically reduces development time.

For developers, Gojo also provides a new way to earn. They can contribute their expertise to train Gojo's AI agents, which are then used by the platform to help other users. When these AI agents generate code for a user, the original developer who contributed to that agent's knowledge gets royalties, creating a win-win scenario for both developers and non-developers.

### How It's Made (Technical)

Gojo is built using a combination of cross-chain infrastructure and advanced AI technologies, bringing together multiple blockchain protocols and decentralized systems to create a seamless experience. At the heart of this project is **LayerZero**, which provides the cross-chain infrastructure connecting **SKALE**, **Story Network**, **Polygon**, and **Base**. This allows Gojo to operate on multiple blockchains, enabling users to interact across chains effortlessly. The AI agents that power Gojo are driven by **Phala Network**, which integrates with LayerZero to handle the core AI operations.

**SKALE** is the primary blockchain where the Gojo app operates. It offers a gasless environment, ensuring users don't have to pay transaction fees, which makes it more accessible. Through **LayerZero**, SKALE mints programmable intellectual properties (IPs) on **Story Network** and creates on-chain attestations in **Polygon**. This combination of networks significantly boosts Gojo's functionality and opens up possibilities for cross-chain code generation. The programmable IPs are a critical feature because they allow developers to claim ownership of their contributions and receive royalties whenever their AI-trained agents generate code for users.

Within **Story Network**, developers create and train domain-specific AI agents. These agents are integral to Gojo’s code-generation capabilities. Every time a developer contributes to Gojo’s AI model, they mint a programmable IP that they own, allowing them to earn royalties based on its use. Since Story is also connected to SKALE via LayerZero, any activity on Story automatically integrates into Gojo's multi-chain operations, ensuring contributions are recorded and rewarded across chains.

Gojo integrates **Polygon** in multiple ways. The AI agents running on Gojo can generate code deployable on the Polygon blockchain. Additionally, Gojo uses **Sign Protocol** on Polygon to verify if users hold enough IP tokens before generating code. Every time a user interacts with the AI agent, **Phala’s core AI agent** signs on-chain attestations to document each code generation. This ensures transparency and traceability in code generation while maintaining user privacy.

For seamless data indexing, Gojo relies on **TheGraph** to track contract data and update the frontend. The custom subgraph built for Gojo indexes all contract interactions, ensuring that data is readily available. This indexed data is crucial for Gojo's token-based system, as it’s used in **Lit Protocol** actions to check if users hold enough Gojo tokens to perform certain operations.

**Lit Protocol** plays a central role in Gojo’s token-based security model. Whenever a user attempts to generate code, Gojo uses **Lit Actions** to verify if they possess enough tokens to proceed. Developers who contribute their code to Gojo encrypt their work using Lit Protocol and store it securely in **Walrus**, Gojo’s decentralized storage solution. When needed, Phala’s AI agents decrypt the code stored in Walrus and use it to generate new code for the user, but only if the user holds sufficient tokens to unlock it.

Users interact with Gojo through an **XMTP-powered chatbot**, which serves as the front-end interface for the **Phala AI agent**. This agent communicates with domain-specific AI agents to generate the requested code. All code generated is encrypted using **Lit Protocol**, ensuring that only users with enough tokens can decrypt and access the generated code on the client side.

For wallet integration, Gojo uses the **Coinbase Developer Platform**. Specifically, **Coinbase MPC wallets** are used by Phala AI agents to sign operations, while the frontend relies on **Coinbase’s on-chain kit** for user authentication and wallet management. Users have the flexibility to use either a **smart wallet** or a standard externally owned account (EOA), providing both ease of use and security.

Finally, all code contributions are stored in **Walrus**, Gojo’s decentralized storage. Developers encrypt their code before storing it, retaining full ownership and control over their intellectual property. When users request code generation, Phala’s AI agents fetch the encrypted data from Walrus, ensuring that user interactions remain secure and private throughout the process.

In essence, Gojo combines a cross-chain infrastructure, token-based security models, and advanced AI agents to offer a no-code solution for building web3 prototypes. It leverages cutting-edge technologies like LayerZero, TheGraph, and Lit Protocol to create an intuitive, secure, and scalable platform.

# Deployments

GojoCore (SKALE) - 0x649d81f1A8F4097eccA7ae1076287616E433c5E8
GojoStoryCore (STORY) - 0x34EC9c9291dB51Cc763AbF2DF45d0a67CBa7244f
GojoStoryUSDWrapper (STORY) - 0x513F5406f1C40874f3c0cD078E606897DC29F67b
GojoWrappedStoryUSD (SKALE) - 0xAa25e4A9db1F3e493B9a20279572e4F15Ce6eEa2
GojoProtocolRelayer (POLYGON) - 0xF1D62f668340323a6533307Bb0e44600783BE5CA
GojoRoyaltyRelayer (POLYGON) - 0x2BB1f234D6889B0dc3cE3a4A1885AcfE1DA30936

# Sponsors

## LayerZero

## SKALE

## Story Protocol

## Polygon

## Sign Protocol

## The Graph

## XMTP

## Coinbase Developer Platform

## Walrus

## Phala Network

## NounsDAO

## Privy

## Fhenix
