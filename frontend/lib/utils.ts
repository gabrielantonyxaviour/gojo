import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { polygonAmoy, skaleEuropaTestnet, storyTestnet } from "viem/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formattedNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "m";
  } else if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.?0+$/, "") + "k";
  } else {
    return num.toString();
  }
}
export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
export function getChainImage(chainId: string): string {
  switch (chainId) {
    case `eip155:${skaleEuropaTestnet.id}`:
      return "/chains/skale.png";
    case `eip155:${storyTestnet.id}`:
      return "/chains/story.png";
    case `eip155:${polygonAmoy.id}`:
      return "/chains/polygon.png";
    default:
      return "/logo-nouns.png";
  }
}
