"use client";
import dynamic from "next/dynamic";
const MuvApp = dynamic(() => import("./MuvApp"), { ssr: false });
export default function Page() { return <MuvApp />; }
