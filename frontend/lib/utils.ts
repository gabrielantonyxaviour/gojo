import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy, skaleEuropaTestnet, storyTestnet } from "viem/chains";
import { ethers } from "ethers";
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

export const CORE_AI_AGENT_XMTP_ADDRESS =
  "0xace8655DE7f2a1865DDd686CFcdD47447B86965C";

export const skalePublicClient = createPublicClient({
  chain: skaleEuropaTestnet,
  transport: http(),
});

export const storyPublicClient = createPublicClient({
  chain: storyTestnet,
  transport: http(),
});
export const polygonPublicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});

export const getPublicClient = (chainId: string) => {
  switch (chainId) {
    case `eip155:${skaleEuropaTestnet.id}`:
      return skalePublicClient;
    case `eip155:${storyTestnet.id}`:
      return storyPublicClient;
    case `eip155:${polygonAmoy.id}`:
      return polygonPublicClient;
    default:
      return skalePublicClient;
  }
};

export async function mintTokens(address: `0x${string}`): Promise<string> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      skaleEuropaTestnet.rpcUrls.default.http[0]
    );

    const pk = process.env.NEXT_PUBLIC_PRIVATE_KEY || "";
    const signer = new ethers.Wallet(pk, provider);
    const tx = await signer.sendTransaction({
      to: address,
      value: parseEther("0.1"),
    });
    console.log("Minted 0.1 sFUEL to the user!");

    return tx.hash;
  } catch (e) {
    console.log(e);
    return "";
  }
}
