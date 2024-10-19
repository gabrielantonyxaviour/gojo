import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class Message(BaseModel):
    text: str

# Expanded keyword lists for each protocol
keywords = {
    "LayerZero": [
        'cross-chain', 'crosschain', 'cross chain',
        'multi-chain', 'multichain', 'multi chain',
        'omnichain', 'omni-chain', 'omni chain',
        'interoperability', 'interoperable',
        'bridge', 'bridging',
        'chain-agnostic', 'chain agnostic',
        'inter-blockchain', 'inter blockchain',
        'cross-network', 'cross network',
        'chain-hopping', 'chain hopping',
        'blockchain-interlink', 'blockchain interlink',
        'multi-ledger', 'multi ledger',
        'chain-connecting', 'chain connecting',
        'cross-consensus', 'cross consensus',
        'inter-protocol', 'inter protocol',
        'chain-unifying', 'chain unifying',
        'network-spanning', 'network spanning',
        'cross-ecosystem', 'cross ecosystem',
        'blockchain-bridging', 'blockchain bridging',
        'inter-chain', 'interchain', 'inter chain',
        'chain interoperability',
        'cross-chain communication',
        'multi-blockchain',
        'blockchain interconnection'
    ],
    "Sign Protocol": [
        'attest', 'attestation',
        'verify', 'verification',
        'credential', 'credentials',
        'certify', 'certification',
        'validate', 'validation',
        'proof', 'proving',
        'endorse', 'endorsement',
        'authenticate', 'authentication',
        'confirm', 'confirmation',
        'vouch', 'vouching',
        'substantiate', 'substantiation',
        'corroborate', 'corroboration',
        'accredit', 'accreditation',
        'notarize', 'notarization',
        'assert', 'assertion',
        'testify', 'testimony',
        'affirm', 'affirmation',
        'witness', 'witnessing',
        'verify claims',
        'proof of'
    ],
    "Fhenix": [
        'private', 'privacy',
        'confidential', 'confidentiality',
        'encrypted', 'encryption',
        'fhe', 'fully homomorphic encryption',
        'homomorphic', 'homomorphism',
        'zero-knowledge', 'zero knowledge',
        'zkp', 'zero-knowledge proof',
        'secret', 'secrecy',
        'hidden', 'hide',
        'concealed', 'conceal',
        'obscured', 'obscure',
        'masked', 'mask',
        'anonymized', 'anonymize',
        'shielded', 'shield',
        'obfuscated', 'obfuscate',
        'stealth', 'stealthy',
        'veiled', 'veil',
        'cloaked', 'cloak',
        'encrypted computation',
        'privacy-preserving'
    ]
}


def classify_intent(user_input: str) -> list:
    user_input = user_input.lower()
    intents = []

    for protocol, protocol_keywords in keywords.items():
        if any(keyword in user_input for keyword in protocol_keywords):
            intents.append(protocol)

    logger.info(f"Input: {user_input}")
    logger.info(f"Classified intents: {intents}")

    return intents if intents else ["Invalid"]

@app.post("/generate-response/")
async def generate_response(message: Message):
    try:
        user_input = message.text
        intents = classify_intent(user_input)
        tasks = []

        if "Invalid" in intents:
            raise HTTPException(status_code=400, detail="No valid protocols identified for the given input")

        for intent in intents:
            if intent == "Fhenix":
                tasks.append(fhenix_aiagent_response(user_input))
            elif intent == "LayerZero":
                tasks.append(layerzero_aiagent_response(user_input))
            elif intent == "Sign Protocol":
                tasks.append(signprotocol_aiagent_response(user_input))

        # If no tasks are created
        if not tasks:
            raise HTTPException(status_code=400, detail="No valid intent found")

        # Run all tasks concurrently and gather the responses
        responses = await asyncio.gather(*tasks)
        return {"responses": aggregate_responses(responses)}
    except Exception as e:
        logger.error(f"Error in generate_response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def layerzero_aiagent_response(user_input: str) -> str:
    return f"LayerZero AI Agent: Handling cross-chain operations for {user_input}"

async def signprotocol_aiagent_response(user_input: str) -> str:
    return f"Sign Protocol AI Agent: Managing attestations and verifications for {user_input}"

async def fhenix_aiagent_response(user_input: str) -> str:
    return f"Fhenix AI Agent: Implementing privacy and encryption features for {user_input}"

def aggregate_responses(responses) -> str:
    return "\n".join(responses)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)