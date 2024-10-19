import numpy as np
from typing import List, Dict
from src.token_counter import num_tokens_from_messages, num_assistant_tokens_from_messages
from src.utils import print_distribution

def analyze_dataset(dataset: List[Dict]):
    n_missing_system = sum(1 for ex in dataset if not any(message["role"] == "system" for message in ex["messages"]))
    n_missing_user = sum(1 for ex in dataset if not any(message["role"] == "user" for message in ex["messages"]))
    n_messages = [len(ex["messages"]) for ex in dataset]
    convo_lens = [num_tokens_from_messages(ex["messages"]) for ex in dataset]
    assistant_message_lens = [num_assistant_tokens_from_messages(ex["messages"]) for ex in dataset]
    
    print("Num examples missing system message:", n_missing_system)
    print("Num examples missing user message:", n_missing_user)
    print_distribution(n_messages, "num_messages_per_example")
    print_distribution(convo_lens, "num_total_tokens_per_example")
    print_distribution(assistant_message_lens, "num_assistant_tokens_per_example")
    n_too_long = sum(1 for l in convo_lens if l > 16385)
    print(f"\n{n_too_long} examples may be over the 16,385 token limit, they will be truncated during fine-tuning")
