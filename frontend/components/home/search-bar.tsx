"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { IconArrowUp, IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { useCallback, useState } from "react";
import Suggestions from "./suggestions";
import { useSendMessage, useStartConversation } from "@xmtp/react-sdk";
import { CORE_AI_AGENT_XMTP_ADDRESS } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEnvironmentStore } from "../context";

export function SearchBar({ conversation }: { conversation: any }) {
  const { prompt, setPrompt } = useEnvironmentStore((store) => store);
  const { startConversation } = useStartConversation();
  const { sendMessage } = useSendMessage();
  const [cachedConversation, setCachedConversation] = useState<any>(null);
  const router = useRouter();
  const handleSendNewMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) {
        alert("Empty message");
        return;
      }

      const newConversation = await startConversation(
        CORE_AI_AGENT_XMTP_ADDRESS,
        message
      );
      setCachedConversation(newConversation?.cachedConversation);
    },
    [startConversation, setCachedConversation, CORE_AI_AGENT_XMTP_ADDRESS]
  );
  return (
    <div className="xl:w-[1000px] lg:w-[800px] w-[600px]">
      <Card>
        <CardContent className="p-0">
          <Input
            value={prompt}
            onChange={(e) => [setPrompt(e.target.value)]}
            placeholder="Ask a question or search for answers..."
            className="2xl:text-lg text-md font-medium p-4 bg-transparent border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          />
          <div className="flex justify-end">
            <Button
              variant={"secondary"}
              className="px-3 py-4 m-2"
              onClick={async () => {
                if (conversation) {
                  console.log("Conversation exists");
                  await sendMessage(conversation, prompt);
                } else {
                  console.log("Creating new converstaion");
                  await handleSendNewMessage(prompt);
                }

                // TODO Contracts: Send a transaction to create new project.

                router.push("/project");
              }}
            >
              <IconArrowUp className="h-5 w-5"></IconArrowUp>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Suggestions setPrompt={setPrompt} />
    </div>
  );
}
