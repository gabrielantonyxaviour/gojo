import Image from "next/image";
import Title from "./title";
import { SearchBar } from "./search-bar";
import { usePrivy } from "@privy-io/react-auth";
import ConnectButton from "../ui/custom/connect-button";

export default function Home() {
  const { login, authenticated } = usePrivy();
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
      {authenticated ? <SearchBar /> : <ConnectButton login={login} />}
    </div>
  );
}
