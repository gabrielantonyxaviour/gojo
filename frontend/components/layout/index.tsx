"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Navigation } from "./navigation";
import { ProjectsBar } from "./projects-bar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { getChainImage, shortenAddress } from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { polygonAmoy, skaleEuropaTestnet, storyTestnet } from "viem/chains";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { ready: privyReady, authenticated, logout } = usePrivy();
  const [openWalletPopover, setOpenWalletPopover] = useState(false);
  const { ready: walletsReady, wallets } = useWallets();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if ((!authenticated || !walletsReady || !privyReady) && pathName != "/") {
      router.push("/");
    }
    console.log("chainId");
    console.log(wallets.length > 0 ? wallets[0].chainId : "NO");
  }, [authenticated, walletsReady, privyReady, pathName]);

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
                <PopoverContent className="bg-neutral-900 w-[200px]">
                  <div className="flex flex-col space-y-1">
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
