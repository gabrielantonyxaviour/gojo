import Image from "next/image";
import Title from "./title";
import { SearchBar } from "./search-bar";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import ConnectButton from "../ui/custom/connect-button";
import { useEffect, useState } from "react";
import { Client, useClient } from "@xmtp/react-sdk";
import { ethers } from "ethers";
import ConnectXmtpButton from "../ui/custom/connect-xmtp-button";

export default function Home() {
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [ethersSigner, setEthersSigner] = useState<ethers.Signer | null>(null);
  const { client, error, isLoading, initialize, disconnect } = useClient();
  const [xmtpLoading, setXmtpLoading] = useState(false);

  useEffect(() => {
    const initialIsOnNetwork =
      localStorage.getItem("isOnNetwork") === "true" || false;

    setIsOnNetwork(initialIsOnNetwork);
  }, []);

  useEffect(() => {
    localStorage.setItem("isOnNetwork", isOnNetwork.toString());
  }, [isOnNetwork]);

  useEffect(() => {
    if (client && !isOnNetwork) {
      setIsOnNetwork(true);
    }
    if (authenticated && isOnNetwork) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setEthersSigner(signer);
      initXmtpWithKeys(signer);
    }
  }, [authenticated, client]);

  const initXmtpWithKeys = async (signer: ethers.Signer) => {
    const options: { env: "dev" | "local" | "production" | undefined } = {
      env: "dev",
    };
    const address = wallets[0]?.address;
    if (!address) return;
    let keys: any = loadKeys(address);
    if (!keys) {
      keys = await Client.getKeys(signer, {
        ...options,
        skipContactPublishing: true,
        persistConversations: false,
      });
      storeKeys(address, keys);
    }
    setXmtpLoading(true);
    await initialize({ keys, options, signer });
  };

  const storeKeys = (walletAddress: string, keys: any) => {
    localStorage.setItem(
      buildLocalStorageKey(walletAddress),
      Buffer.from(keys).toString("binary")
    );
  };

  const loadKeys = (walletAddress: string) => {
    const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
    return val ? Buffer.from(val, "binary") : null;
  };

  const buildLocalStorageKey = (walletAddress: string) => {
    return walletAddress ? `xmtp:dev:keys:${walletAddress}` : "";
  };

  const handleLogout = async () => {
    setIsOnNetwork(false);
    const address = wallets[0]?.address;
    wipeKeys(address);
    console.log("wipe", address);
    setEthersSigner(null);
    setIsOnNetwork(false);
    await disconnect();
    // setSelectedConversation(null);
    localStorage.removeItem("isOnNetwork");
    localStorage.removeItem("isConnected");
    // if (typeof onLogout === "function") {
    //   onLogout();
    // }
  };
  const wipeKeys = (walletAddress: string) => {
    localStorage.removeItem(buildLocalStorageKey(walletAddress));
  };

  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <Image
        src="/logo-nouns.png"
        alt="logo"
        width={80}
        height={80}
        className="rounded-full opacity-90"
      />
      <Title />
      {!authenticated ? (
        <ConnectButton login={login} />
      ) : !isOnNetwork ? (
        <ConnectXmtpButton
          disabled={!ethersSigner}
          login={() => {
            initXmtpWithKeys(ethersSigner!);
          }}
        />
      ) : (
        <SearchBar />
      )}
    </div>
  );
}
