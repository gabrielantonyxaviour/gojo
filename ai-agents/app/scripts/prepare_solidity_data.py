import os
import json
from typing import List, Dict

def read_solidity_file(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read()

def create_training_example(code: str, agent: str) -> Dict:
    return {
        "messages": [
            {"role": "system", "content": f"You are an AI assistant specialized in {agent} Solidity development. Provide accurate and helpful information about {agent} smart contracts."},
            {"role": "user", "content": "Can you explain this Solidity code and provide any insights or improvements?"},
            {"role": "assistant", "content": f"Certainly! Let's analyze this {agent} Solidity code:\n\n```solidity\n{code}\n```\n\nHere's an explanation of the code and some insights:\n\n[Your AI would provide a detailed explanation here]\n\nPotential improvements or considerations:\n1. [Improvement suggestion 1]\n2. [Improvement suggestion 2]\n3. [Improvement suggestion 3]\n\nRemember to always thoroughly test and audit smart contracts before deployment, especially when dealing with {agent}-specific functionalities."}
        ]
    }

def prepare_training_data(agent: str, solidity_files: List[str]) -> List[Dict]:
    training_data = []
    for file_path in solidity_files:
        code = read_solidity_file(file_path)
        training_example = create_training_example(code, agent)
        training_data.append(training_example)
    return training_data

def save_jsonl(data: List[Dict], output_file: str):
    with open(output_file, 'w') as f:
        for item in data:
            json.dump(item, f)
            f.write('\n')

def main():
    agents = ['LayerZero', 'Fhenix', 'Sign Protocol']
    base_path = 'data/solidity_files'  # Adjust this path as needed
    
    for agent in agents:
        agent_path = os.path.join(base_path, agent.lower().replace(' ', '_'))
        solidity_files = [os.path.join(agent_path, f) for f in os.listdir(agent_path) if f.endswith('.sol')]
        
        training_data = prepare_training_data(agent, solidity_files)
        output_file = f'data/{agent.lower().replace(" ", "_")}_training_data.jsonl'
        save_jsonl(training_data, output_file)
        print(f"Created training data for {agent}: {output_file}")

if __name__ == "__main__":
    main()