"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ClientProviders = dynamic(() => import("@/components/ClientProviders"), {
  ssr: false,
});

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Or a loading spinner
  }

  return <ClientProviders>{children}</ClientProviders>;
}