"use client";

import { useStoreModal } from "@/hooks/use-store-moda";
import { useEffect } from "react";

export default function SetupPage() {
  // const storeModal = useStoreModal();

  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]); // we dont allow to close modal here

  return <div className="p-4">Root Page</div>;
}
