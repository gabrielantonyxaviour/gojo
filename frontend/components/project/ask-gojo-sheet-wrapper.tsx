import { XMTPProvider } from "@xmtp/react-sdk";
import AskGojoSheet from "./ask-gojo-sheet";

export default function AskGojoSheetWrapper({ askGojo }: { askGojo: any }) {
  return (
    <XMTPProvider>
      <AskGojoSheet askGojo={askGojo} />
    </XMTPProvider>
  );
}
