"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Navigation } from "./navigation";
import { ProjectsBar } from "./projects-bar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { shortenAddress } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { ready: privyReady, authenticated, user } = usePrivy();
  const { ready: walletsReady } = useWallets();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if ((!authenticated || !walletsReady || !privyReady) && pathName != "/") {
      router.push("/");
    }
  }, [authenticated, walletsReady, privyReady, pathName]);

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
          {" "}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="flex justify-center">
              <Navigation />
            </div>
          </div>
          <div className="fixed top-4 right-4 z-50">
            <div className="flex justify-center">
              <Card className="bg-neutral-900">
                <CardContent className="flex space-x-2 py-2 px-6 items-center">
                  <img
                    src={`https://noun-api.com/beta/pfp?name=${user?.wallet?.address}`}
                    width={30}
                    height={30}
                    alt="nouns_pfp"
                    className="rounded-full"
                  />
                  <p>{shortenAddress(user?.wallet?.address || "")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
