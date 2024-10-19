import os
from dotenv import load_dotenv
from dstack_sdk import AsyncTappdClient, DeriveKeyResponse, TdxQuoteResponse
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import asyncio
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multioutput import MultiOutputClassifier
from sklearn.linear_model import LogisticRegression
import numpy as np
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
endpoint = 'http://host.docker.internal:8090'

class Message(BaseModel):
    text: str

training_data = [
    # Fhenix-specific prompts
    ("Create a private voting system where vote counts are visible but individual votes are encrypted", ["Fhenix"]),
    ("Implement a zero-knowledge proof system for identity verification", ["Fhenix"]),
    ("Develop a confidential DeFi lending platform with encrypted loan amounts", ["Fhenix"]),
    ("Build a private NFT marketplace where bids are encrypted", ["Fhenix"]),
    ("Create a smart contract for encrypted on-chain data storage", ["Fhenix"]),
    ("Implement a private order book for a decentralized exchange", ["Fhenix"]),
    ("Design a confidential supply chain management system", ["Fhenix"]),
    ("Develop a private reputation system with encrypted user ratings", ["Fhenix"]),
    ("Create a confidential auction system with encrypted bids", ["Fhenix"]),
    ("Implement a private prediction market with encrypted stakes", ["Fhenix"]),
    ("Build a confidential governance system with encrypted votes", ["Fhenix"]),
    ("Design a private loyalty program with encrypted point balances", ["Fhenix"]),
    ("Create a confidential crowdfunding platform with hidden contribution amounts", ["Fhenix"]),
    ("Implement a private data marketplace with encrypted data access", ["Fhenix"]),
    ("Develop a confidential insurance claim system with encrypted personal information", ["Fhenix"]),
    ("Build a private decentralized identity system using FHE", ["Fhenix"]),
    ("Create a confidential gaming platform with encrypted in-game assets", ["Fhenix"]),
    ("Implement a private credit scoring system with encrypted financial data", ["Fhenix"]),
    ("Design a confidential healthcare data management system using Fhenix", ["Fhenix"]),
    ("Develop a private on-chain KYC system with encrypted user data", ["Fhenix"]),

    # LayerZero-specific prompts
    ("Implement cross-chain token swaps between Polygon and SKALE", ["LayerZero"]),
    ("Create an omnichain NFT that can be transferred between Story Network and Polygon", ["LayerZero"]),
    ("Develop a cross-chain governance system for a DAO operating on multiple chains", ["LayerZero"]),
    ("Build a decentralized exchange that allows trading across SKALE and Polygon", ["LayerZero"]),
    ("Implement a cross-chain lending protocol between Story Network and SKALE", ["LayerZero"]),
    ("Create a multi-chain yield farming platform using LayerZero", ["LayerZero"]),
    ("Develop an omnichain liquidity protocol across supported chains", ["LayerZero"]),
    ("Build a cross-chain oracle system for price feeds across multiple networks", ["LayerZero"]),
    ("Implement a bridge for transferring stablecoins between Polygon and Story Network", ["LayerZero"]),
    ("Create a cross-chain collateralized debt position (CDP) system", ["LayerZero"]),
    ("Develop an omnichain gaming platform with assets usable across multiple chains", ["LayerZero"]),
    ("Build a cross-chain identity verification system using LayerZero", ["LayerZero"]),
    ("Implement a multi-chain staking protocol with rewards across networks", ["LayerZero"]),
    ("Create a decentralized social network with cross-chain content sharing", ["LayerZero"]),
    ("Develop an omnichain prediction market platform", ["LayerZero"]),
    ("Build a cross-chain asset management system for institutional investors", ["LayerZero"]),
    ("Implement a multi-chain insurance protocol using LayerZero", ["LayerZero"]),
    ("Create a cross-chain automated market maker (AMM)", ["LayerZero"]),
    ("Develop an omnichain name service that works across multiple networks", ["LayerZero"]),
    ("Build a cross-chain decentralized autonomous organization (DAO)", ["LayerZero"]),

    # Sign Protocol-specific prompts
    ("Create an on-chain attestation system for academic credentials on Polygon", ["Sign Protocol"]),
    ("Implement a verifiable claims protocol for professional certifications", ["Sign Protocol"]),
    ("Develop a reputation system based on verifiable attestations", ["Sign Protocol"]),
    ("Build a decentralized identity solution with attestation support on Polygon", ["Sign Protocol"]),
    ("Create a system for issuing and verifying digital badges using Sign Protocol", ["Sign Protocol"]),
    ("Implement an attestation-based voting mechanism for DAOs", ["Sign Protocol"]),
    ("Develop a protocol for creating and verifying on-chain reviews and ratings", ["Sign Protocol"]),
    ("Build a credential verification system for freelancers on Polygon", ["Sign Protocol"]),
    ("Create an attestation framework for verifying real-world assets on-chain", ["Sign Protocol"]),
    ("Implement a system for issuing and verifying insurance claims using Sign Protocol", ["Sign Protocol"]),
    ("Develop an on-chain know-your-customer (KYC) attestation system", ["Sign Protocol"]),
    ("Build a verifiable credential system for medical professionals", ["Sign Protocol"]),
    ("Create an attestation-based social graph on Polygon", ["Sign Protocol"]),
    ("Implement a protocol for verifying and attesting to carbon credits", ["Sign Protocol"]),
    ("Develop a system for creating and verifying on-chain employment history", ["Sign Protocol"]),
    ("Build an attestation framework for verifying digital content authenticity", ["Sign Protocol"]),
    ("Create a decentralized fact-checking system using Sign Protocol", ["Sign Protocol"]),
    ("Implement a protocol for verifying and attesting to software dependencies", ["Sign Protocol"]),
    ("Develop an on-chain system for verifying and attesting to legal documents", ["Sign Protocol"]),
    ("Build a reputation-based lending protocol using Sign Protocol attestations", ["Sign Protocol"]),

    # Prompts that don't fit any of the three protocols
    ("Implement a simple token transfer on Ethereum", ["Invalid"]),
    ("Create a basic smart contract for an ICO on Binance Smart Chain", ["Invalid"]),
    ("Develop a decentralized exchange on Solana", ["Invalid"]),
    ("Build a yield farming protocol on Avalanche", ["Invalid"]),
    ("Implement a governance system for a DAO on Tezos", ["Invalid"]),
    ("Create a non-fungible token (NFT) marketplace on Flow", ["Invalid"]),
    ("Develop a decentralized social media platform on EOS", ["Invalid"]),
    ("Build a prediction market on Polkadot", ["Invalid"]),
    ("Implement a cross-chain bridge between Ethereum and Binance Smart Chain", ["Invalid"]),
    ("Create a decentralized storage solution using Filecoin", ["Invalid"]),

    # Additional mixed examples
    ("Develop a private cross-chain voting system", ["Invalid"]),
    ("Create an attestation system for private data on Fhenix", ["Invalid"]),
    ("Implement a confidential bridge between Polygon and SKALE", ["Invalid"]),
    ("Build a cross-chain attestation protocol using LayerZero", ["Invalid"]),
    ("Design a privacy-preserving reputation system on Polygon", ["Sign Protocol"]),
    ("Create a confidential cross-chain liquidity protocol", ["Invalid"]),
    ("Implement a verifiable random function (VRF) on Fhenix", ["Fhenix"]),
    ("Develop a private oracle system for cross-chain data", ["Invalid"]),
    ("Build an attestation-based identity system with privacy features", ["Sign Protocol"]),
    ("Create a zero-knowledge proof system for cross-chain transactions", ["Invalid"]),

     ("Create a cross-chain NFT contract that attests each NFT mint", ["LayerZero", "Sign Protocol"]),
    ("Implement a cross-chain voting system with verifiable attestations", ["LayerZero", "Sign Protocol"]),
    ("Develop a multi-chain liquidity pool with verified participant credentials", ["LayerZero", "Sign Protocol"]),
    ("Build a cross-chain decentralized exchange with trade attestations", ["LayerZero", "Sign Protocol"]),
    ("Create an omnichain identity system with verifiable claims", ["LayerZero", "Sign Protocol"]),
    ("Implement a cross-chain lending protocol with attested collateral", ["LayerZero", "Sign Protocol"]),
    ("Develop a multi-chain governance system with verifiable participation", ["LayerZero", "Sign Protocol"]),
    ("Build a cross-chain prediction market with attested outcomes", ["LayerZero", "Sign Protocol"]),
    ("Create a decentralized social network with cross-chain interactions and verified user credentials", ["LayerZero", "Sign Protocol"]),
    ("Implement a multi-chain supply chain management system with verified checkpoints", ["LayerZero", "Sign Protocol"]),
    ("Develop a cross-chain asset management platform with attested performance metrics", ["LayerZero", "Sign Protocol"]),
    ("Build an omnichain insurance protocol with verified risk assessments", ["LayerZero", "Sign Protocol"]),
    ("Create a cross-chain decentralized autonomous organization (DAO) with attested membership", ["LayerZero", "Sign Protocol"]),
    ("Implement a multi-chain gaming platform with verified achievements", ["LayerZero", "Sign Protocol"]),
    ("Develop a cross-chain oracle network with attested data sources", ["LayerZero", "Sign Protocol"]),
    ("Build a decentralized identity verification system that works across chains", ["LayerZero", "Sign Protocol"]),
    ("Create a multi-chain yield farming protocol with attested rewards", ["LayerZero", "Sign Protocol"]),
    ("Implement a cross-chain NFT marketplace with verified ownership transfers", ["LayerZero", "Sign Protocol"]),
    ("Develop an omnichain reputation system with attested reviews", ["LayerZero", "Sign Protocol"]),
    ("Build a cross-chain decentralized file storage system with verified file integrity", ["LayerZero", "Sign Protocol"]),
    ("Create a multi-chain carbon credit trading platform with verified emission reductions", ["LayerZero", "Sign Protocol"]),
    ("Implement a cross-chain decentralized computing platform with attested results", ["LayerZero", "Sign Protocol"]),
    ("Develop an omnichain loyalty program with verified reward redemptions", ["LayerZero", "Sign Protocol"]),
    ("Build a cross-chain decentralized advertising network with attested engagement metrics", ["LayerZero", "Sign Protocol"]),
    ("Create a multi-chain crowdfunding platform with verified project milestones", ["LayerZero", "Sign Protocol"]),

    # Examples using Fhenix alone (without cross-chain functionality)
    ("Implement a private voting system on a single chain", ["Fhenix"]),
    ("Develop a confidential DeFi platform with encrypted transactions", ["Fhenix"]),
    ("Build a privacy-preserving identity management system", ["Fhenix"]),
    ("Create a zero-knowledge proof system for credential verification", ["Fhenix"]),
    ("Implement a private order book for a decentralized exchange", ["Fhenix"]),
    ("Develop a confidential supply chain management system on a single chain", ["Fhenix"]),
    ("Build a privacy-focused social network with encrypted user data", ["Fhenix"]),
    ("Create a confidential prediction market with encrypted bets", ["Fhenix"]),
    ("Implement a private credit scoring system", ["Fhenix"]),
    ("Develop a zero-knowledge compliance system for financial institutions", ["Fhenix"])

    
]
texts = [text for text, _ in training_data]
labels = []
all_labels = set()

for _, label in training_data:
    if isinstance(label, list):
        labels.append(label)
        all_labels.update(label)
    else:
        labels.append([label])
        all_labels.add(label)

all_labels = list(all_labels)

# Create binary label matrix
y = np.zeros((len(labels), len(all_labels)))
for i, label_set in enumerate(labels):
    for label in label_set:
        y[i, all_labels.index(label)] = 1

# Vectorizer and model for intent recognition
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)
model = MultiOutputClassifier(LogisticRegression(C=1.0, solver='lbfgs', max_iter=1000))
model.fit(X, y)

def classify_intent(user_input: str) -> list:
    input_vec = vectorizer.transform([user_input])
    prediction_proba = model.predict_proba(input_vec)
    
    threshold = 0.3  # Adjust this threshold as needed
    predicted_labels = []
    
    for i, proba in enumerate(prediction_proba[0]):
        if proba[0][1] > threshold:
            predicted_labels.append(all_labels[i])
    
    logger.info(f"Input: {user_input}")
    logger.info(f"Prediction probabilities: {prediction_proba}")
    logger.info(f"Predicted labels: {predicted_labels}")
    
    return predicted_labels if predicted_labels else ["Invalid"]

@app.post("/generate-response/")
async def generate_response(message: Message):
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

# ... rest of your code (AI agent response functions, etc.) ...

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)