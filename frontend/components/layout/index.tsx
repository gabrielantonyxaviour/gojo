"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Navigation } from "./navigation";
import { ProjectsBar } from "./projects-bar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  getChainImage,
  getPublicClient,
  mintTokens,
  shortenAddress,
  skalePublicClient,
  storyPublicClient,
} from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  blast,
  polygonAmoy,
  skaleEuropaTestnet,
  storyTestnet,
} from "viem/chains";
import { useEnvironmentStore } from "../context";
import { formatEther } from "viem";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setBalance, balance } = useEnvironmentStore((state) => state);
  const { ready: privyReady, authenticated, logout } = usePrivy();
  const [openWalletPopover, setOpenWalletPopover] = useState(false);
  const { ready: walletsReady, wallets } = useWallets();
  const pathName = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if ((!authenticated || !walletsReady || !privyReady) && pathName != "/") {
      router.push("/");
    }
    if (authenticated && walletsReady && privyReady) {
      getPublicClient(wallets[0].chainId)
        .getBalance({
          address: wallets[0].address as `0x${string}`,
        })
        .then((balance) => {
          console.log("FETCHING BALANCE");
          setBalance(formatEther(balance));
          if (
            wallets[0].chainId == `eip155:${skaleEuropaTestnet.id}` &&
            parseFloat(formatEther(balance)) < 0.1
          ) {
            mintTokens(wallets[0].address as `0x${string}`).then((txHash) => {
              toast({
                title: "Welcome Aboard! 🚀",
                description:
                  "You have been minted 0.1 sFUEL to use the app. No more gas fees :)",
                action: (
                  <ToastAction
                    altText="Goto schedule to undo"
                    onClick={() => {
                      window.open(
                        "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/tx/" +
                          txHash,
                        "_blank"
                      );
                    }}
                  >
                    View Tx
                  </ToastAction>
                ),
              });
              skalePublicClient
                .getBalance({
                  address: wallets[0].address as `0x${string}`,
                })
                .then((balance) => {
                  setBalance(formatEther(balance));
                });
            });
          }
        });
    }
  }, [authenticated, walletsReady, privyReady, pathName, wallets]);

  useEffect(() => {}, []);

  return !privyReady || !walletsReady ? (
    <div className="flex flex-col items-center justify-center h-screen w-screen space-y-4">
      <Image src="/loading.gif" width={200} height={200} alt="loading" />
      <p className="text-xl">Loading</p>
    </div>
  ) : (
    <div className="h-screen w-screen select-text">
      {children}
      <ProjectsBar />
      {authenticated && (
        <>
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="flex justify-center">
              <Navigation />
            </div>
          </div>
          <div className="fixed top-4 right-4 z-50">
            <div className="flex justify-center">
              <Popover
                open={openWalletPopover}
                onOpenChange={setOpenWalletPopover}
              >
                <PopoverTrigger asChild>
                  <Card className="bg-neutral-900 cursor-pointer">
                    <CardContent className="flex space-x-2 py-0 pl-2 pr-3 items-center">
                      <Image
                        src={getChainImage(wallets[0].chainId)}
                        width={30}
                        height={30}
                        alt="avatar"
                        className="rounded-full my-2"
                      />
                      <p>
                        {parseFloat(balance).toFixed(2)}{" "}
                        {wallets[0].chainId == `eip155:${skaleEuropaTestnet.id}`
                          ? "sFUEL"
                          : wallets[0].chainId == `eip155:${polygonAmoy.id}`
                          ? "POL"
                          : "IP"}
                      </p>
                      <Separator orientation="vertical" className="h-[44px]" />
                      <img
                        src={`https://noun-api.com/beta/pfp?name=${wallets[0].address}`}
                        width={30}
                        height={30}
                        alt="nouns_pfp"
                        className="rounded-full my-2 "
                      />
                      <p className="pr-1">
                        {shortenAddress(wallets[0].address || "")}
                      </p>
                    </CardContent>
                  </Card>
                </PopoverTrigger>
                <PopoverContent className="bg-neutral-900 w-[250px]">
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={
                        wallets[0].chainId == `eip155:${skaleEuropaTestnet.id}`
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => {
                        wallets[0].switchChain(skaleEuropaTestnet.id);
                        setOpenWalletPopover(false);
                      }}
                      className="flex space-x-2 justify-center"
                    >
                      <Image
                        src="/chains/skale.png"
                        width={20}
                        height={20}
                        alt="skale"
                      />
                      <p>SKALE</p>
                    </Button>
                    <Button
                      variant={
                        wallets[0].chainId == `eip155:${polygonAmoy.id}`
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => {
                        wallets[0].switchChain(polygonAmoy.id);
                        setOpenWalletPopover(false);
                      }}
                      className="flex space-x-2 justify-center"
                    >
                      <Image
                        src="/chains/polygon.png"
                        width={20}
                        height={20}
                        alt="polygon"
                      />
                      <p>Polygon</p>
                    </Button>
                    <Button
                      variant={
                        wallets[0].chainId == `eip155:${storyTestnet.id}`
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => {
                        wallets[0].switchChain(storyTestnet.id);
                        setOpenWalletPopover(false);
                      }}
                      className="flex space-x-2 justify-center"
                    >
                      <Image
                        src="/chains/story.png"
                        width={20}
                        height={20}
                        alt="story"
                      />
                      <p>Story</p>
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        logout();
                        setOpenWalletPopover(false);
                      }}
                    >
                      Disconnect
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
