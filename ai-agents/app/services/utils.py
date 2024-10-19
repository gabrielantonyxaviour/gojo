import numpy as np
from typing import List

def print_distribution(values: List[float], name: str):
    print(f"\n#### Distribution of {name}:")
    print(f"min / max: {min(values)}, {max(values)}")
    print(f"mean / median: {np.mean(values):.2f}, {np.median(values):.2f}")
    print(f"p5 / p95: {np.quantile(values, 0.05):.2f}, {np.quantile(values, 0.95):.2f}")
