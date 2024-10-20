// import Home from "./Home";
import { XMTPProvider } from "@xmtp/react-sdk";
import AskGojoSheet from "./ask-gojo-sheet";

export default function AskGojoSheetWrapper({
  isPWA = false,
  askGojo,
  wallet,
  onLogout,
  isContained = false,
  isConsent = false,
}: {
  isPWA?: boolean;
  askGojo: any;
  wallet: any;
  onLogout: any;
  isContained?: boolean;
  isConsent?: boolean;
}) {
  return (
    <XMTPProvider>
      <AskGojoSheet
        askGojo={askGojo}
        isPWA={isPWA}
        wallet={wallet}
        onLogout={onLogout}
        isConsent={isConsent}
        isContained={isContained}
      />
    </XMTPProvider>
  );
}
