"use client";

import dynamic from "next/dynamic";
const XmtpWrapper = dynamic(() => import("@/components/home/xmtp-wrapper"), {
  ssr: false,
});
export default function HomePage() {
  return <XmtpWrapper />;
}
