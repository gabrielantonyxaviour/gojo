# Frontend

## Proper Demo Flow

UI (Nouns)
Contracts (LayerZero, Polygon, SKALE)
Indexer (TheGraph)

1. Let's say that I train my domain specific AI agents with some pieces of code. (PHALA + Lit + Walrus)
2. My core AI agent is trained to interact and handle these domain specific AI agents. (PHALA + COINBASE MPC + Sign Protocol)
3. The user enters the app, logs in and clicks on create new project gaslessly using SKALE. (COINBASE)
4. After creating the app, the user can create nodes with prompts aka. AI Agents (XMTP chat + PHALA + Lit)
5. Need to decrypt the encrypted code in the client side and parse it properly (Lit)
6. Run the code in the client side and with smart contract calls interaction (COINBASE)
7. OPTIONAL: Code contribution UI which makes the user import his code directly from Github (Walrus + Lit)

## Contracts

#### Functions

1. Create project - SKALE
2. Register generation (called by AI Agent. Keeps track of consumed WrappedGojoIP for the project id.) - SKALE
3. Register export (pay for the consumption with WrappedGojoIP, using Lit Action) - SKALE
4. Consume WrappedGojoIP called by Gojo AI agent - SKALE
5. Unwrap IP (converts WrappedGojoIP to IP and sends it to Story) - SKALE
6. Register AI agent/ Whitlist AI agent - Story and Crosschain txs from Story to SKALE
7. Register knowledge. Mints IP to the user. - Story
8. Wrap IP (Converts IP to WrappedGojoIP and sends it to SKALE) - Story
9. Make attestation (hook verifies the logic) - Polygon

#### Contracts Pending

1. Attestation validation logic
2. Fix SKALE crosschain fee token issue

### Added Features

1. Implement as IP currency as OFT and Each resource as ONFT?
2. Implement FLOW
3. Proper register knowledge UI
4. Copy button next to deployment in the node

### SUI Wallet

0x96183944b1629adeb589da64589ce74e85946b8e7040ba106b7fcfd71ad9fd83

## TODO

Before 7 am

1. Complete contracts fully and tested with indexer (with some bugs)
2. Test graph

Sat Morning

1. Complete Phala
2. Complete Lit Actions

Sat Evening

1. Complete XMTP

Sat Night to morning

1. Complete Everything hopefully

## TX flow

1. Deploy contracts
2. Create AI agent - GojoStoryCore
3. Upload resources - GojoStoryCore
4. Create project - GojoCore
5. Register generation - GojoCore
6. Export Project - GojoCore

## TODO

1. Phala AI agents
2. Lit PRotocol
3. XMTP
4. Phala web hosting
5. Make contracts work
   - What options do I need to pass - LayerZero
6. Build frontend components
7. Integrate frontend
8. Subgraphs

## LAter

1. IP metadata usage
2. Create new group when revenue gets registered. REvenue flow of Story protocol

## Steps

1. Test full contracts flow - 1 hour
2. Setup Phala with Message kit and connect fe - 1 hour
3. Contract calls - 30 mins

## IMPORTANT POINTS

1. Problem with hackathons - the knowledge gap, what do protocols actually need from hacks
2. ⁠Wasted code from hacakthons. Finding good code is hard. The new hackathon?
3. ⁠ChatGPT not useful? Dynamic growth nature of web3 protocols
4. ⁠Why TEE and XMTP?
5. ⁠Win win win situation. Pros - noobs - protocols

# Transactions

1. Create resource
2. Create project
3. Make generation
4. Export project
5. Get consumed IP
