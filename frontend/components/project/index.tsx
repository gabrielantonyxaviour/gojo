"use client";
import Flow from "@/components/project/flow";
import { ToolBar } from "@/components/project/tool-bar";
import { Edge, Node } from "@/lib/type";
import {
  MarkerType,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import CreateNodeModal from "./create-node-modal";
import AskGojoSheet from "./ask-gojo-sheet";
import ExportModal from "./export-modal";
import { useEnvironmentStore } from "../context";
import AppTestingSheet from "./app-testing-sheet";
import CreateEdgeModal from "./create-edge-modal";
import dynamic from "next/dynamic";
import { idToChain } from "@/lib/utils";
const AskGojoSheetWrapper = dynamic(
  () => import("@/components/project/ask-gojo-sheet-wrapper"),
  {
    ssr: false,
  }
);
const initNodes: Node[] = [];

const initEdges: Edge[] = [];
export default function Project() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const { prompt, setPrompt, setConversations, conversations } =
    useEnvironmentStore((state) => state);
  const [isGenerated, setIsGenerated] = useState(false);

  const [nodeIds, setNodeIds] = useState(0);
  const [edgeIds, setEdgeIds] = useState(0);
  const [openCreateNodeModal, setOpenCreateNodeModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [openCreateEdgeModal, setOpenCreateEdgeModal] = useState<any>(null);
  const { askGojo, setOpenAskGojo, appSettings, setOpenAppSettings } =
    useEnvironmentStore((state) => state);

  useEffect(() => {
    console.log("Updating ask gojo");
    console.log(askGojo);
  }, [askGojo]);

  useEffect(() => {
    if (!isGenerated) {
      setIsGenerated(true);
      if (!askGojo) setOpenAskGojo(true);
      setConversations([
        ...conversations,
        {
          role: "user",
          message: prompt,
        },
      ]);

      fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }).then(async (res) => {
        const { data } = await res.json();
        const { text, contracts } = data;

        setConversations([
          ...conversations,
          {
            role: "gojo",
            message: data.text,
          },
        ]);
        const nodeChains = nodes.map((node) => node.data.chain.chainId);
        const formattedContracts = contracts.map((c: any) => {
          return {
            label: c.name,
            chain: {
              name: idToChain[c.chain].name,
              chainId: c.chain,
              image: idToChain[c.chain].image,
            },
            address: "0x0000000000000000000000000000000000000000",
            salt: Math.floor(Math.random() * 100000000001),
          };
        });
        const finalContractsData = formattedContracts.map((c: any) => {
          if (nodeChains.includes(c.chain.chainId)) {
            return {
              label: c.label,
              chain: {
                name: c.chain.name,
                chainId: c.chain.chainId,
                image: c.chain.image,
              },
              address: "0x",
              salt: Math.floor(Math.random() * 100000000001),
            };
          }
        });

        // setNodeIds((prev) => {
        //   setNodes((nodes) => [
        //     ...nodes,
        //     {
        //       id: prev.toString(),
        //       type: "custom",
        //       data: {
        //         label: contracts
        //         address: "0x0000000000000000000000000000000000000000",
        //         salt: Math.floor(Math.random() * 100000000001),
        //       },
        //       position: { x: 0, y: 100 },
        //     },
        //   ]);
        // return prev + contracts;
        // });
      });
    }
  }, [prompt, isGenerated]);

  const onAddNode = useCallback(
    (data: {
      label: string;
      chain: { name: string; chainId: number; image: string };
    }) => {
      setNodeIds((prev) => {
        setNodes((nodes) => [
          ...nodes,
          {
            id: prev.toString(),
            type: "custom",
            data: {
              ...data,
              address: "0x0000000000000000000000000000000000000000",
              salt: Math.floor(Math.random() * 100000000001),
            },
            position: { x: 0, y: 100 },
          },
        ]);
        return prev + 1;
      });
    },
    []
  );

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex-1">
        <Flow
          nodes={nodes}
          edges={edges}
          setEdges={setEdges}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setNodeIds={setNodeIds}
          setEdgeIds={setEdgeIds}
          setOpenCreateEdgeModal={setOpenCreateEdgeModal}
        />
      </div>
      <div className="fixed top-0 left-0 right-0 select-none ">
        <div className="flex justify-center">
          <p className="text-center 2xl:text-lg text-sm font-medium py-2 px-4  bg-gray-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-300 rounded-b-lg">
            A Crosschain Airdrop
          </p>
        </div>
      </div>
      <ToolBar
        setOpenCreateNodeModal={setOpenCreateNodeModal}
        setOpenExportModal={setOpenExportModal}
      />
      <CreateNodeModal
        onAddNode={onAddNode}
        open={openCreateNodeModal}
        setOpen={setOpenCreateNodeModal}
      />
      <CreateEdgeModal
        edgeData={openCreateEdgeModal}
        setEdgeData={setOpenCreateEdgeModal}
      />
      <AppTestingSheet appTesting={appSettings} />
      <ExportModal
        open={openExportModal}
        setOpen={setOpenExportModal}
        name={"A Crosschain Airdrop"}
      />
      <AskGojoSheetWrapper askGojo={askGojo} />
    </div>
  );
}
