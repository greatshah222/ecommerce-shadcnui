"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

// THIS IS JUST FOR NEXT JS SERVER SIDE RENDERING. MODAL IS CLIENT SIDE COMPONENT AND IT CAN CAUSE HYDRATION ISSUE

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
};
