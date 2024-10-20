import Image from "next/image";
import Title from "./title";
import { SearchBar } from "./search-bar";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import ConnectButton from "../ui/custom/connect-button";
import { useCallback, useEffect, useState } from "react";
import {
  Client,
  useClient,
  useConversations,
  useStartConversation,
} from "@xmtp/react-sdk";
import { ethers } from "ethers";
import ConnectXmtpButton from "../ui/custom/connect-xmtp-button";
import { CORE_AI_AGENT_XMTP_ADDRESS } from "@/lib/utils";
import { useEnvironmentStore } from "../context";
import { IconLogout } from "@tabler/icons-react";
import { Button } from "../ui/button";

export default function Home() {
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [ethersSigner, setEthersSigner] = useState<ethers.Signer | null>(null);
  const { client, error, isLoading, initialize, disconnect } = useClient();
  const [xmtpLoading, setXmtpLoading] = useState(false);
  const { conversation, setConversation } = useEnvironmentStore(
    (store) => store
  );
  const { conversations } = useConversations();
  useEffect(() => {
    if (authenticated && isOnNetwork) {
      const filtered = conversations.filter(
        (conversation) =>
          conversation.peerAddress === CORE_AI_AGENT_XMTP_ADDRESS
      );
      if (filtered.length > 0) {
        setConversation(filtered[0]);
      }
    }
  }, [authenticated, isOnNetwork, client]);
  useEffect(() => {
    const initialIsOnNetwork =
      localStorage.getItem("isOnNetwork") === "true" || false;

    setIsOnNetwork(initialIsOnNetwork);
  }, []);

  useEffect(() => {
    localStorage.setItem("isOnNetwork", isOnNetwork.toString());
  }, [isOnNetwork]);

  useEffect(() => {
    console.log("client");
    console.log(client);
    if (client && !isOnNetwork) {
      setIsOnNetwork(true);
      console.log("isOnNetwork", isOnNetwork);
    }
    if (authenticated && isOnNetwork) {
      console.log("SET SIGNER", isOnNetwork);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setEthersSigner(signer);
      initXmtpWithKeys(signer);
    }
  }, [authenticated, client]);

  const initXmtpWithKeys = async (signer: ethers.Signer) => {
    try {
      const options: { env: "dev" | "local" | "production" | undefined } = {
        env: "production",
      };
      const address = wallets[0]?.address;
      if (!address) return;
      let keys: any = loadKeys(address);
      if (!keys) {
        console.log("get keys");
        console.log(signer);
        console.log({
          ...options,
          skipContactPublishing: true,
          persistConversations: false,
        });
        keys = await Client.getKeys(signer, {
          ...options,
          skipContactPublishing: true,
          persistConversations: false,
        });
        storeKeys(address, keys);
      }
      setXmtpLoading(true);
      await initialize({ keys, options, signer });
    } catch (e) {
      // TODO: Change this temp fix
      setIsOnNetwork(true);
    }
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
    return walletAddress ? `xmtp:production:keys:${walletAddress}` : "";
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
          disabled={!ethersSigner || isLoading}
          login={() => {
            initXmtpWithKeys(ethersSigner!);
          }}
        />
      ) : (
        <>
          <SearchBar conversation={conversation} />
          <Button
            className="cursor-pointer flex space-x-2"
            variant={"outline"}
            onClick={() => {
              console.log("logout");
              handleLogout();
            }}
          >
            <IconLogout onClick={handleLogout} />
            <p>Logout XMTP</p>
          </Button>
        </>
      )}
    </div>
  );
}
