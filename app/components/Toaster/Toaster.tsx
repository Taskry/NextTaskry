"use client";

import { BASE_TOAST_CLASSNAME } from "@/lib/toast-style";
import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        className: BASE_TOAST_CLASSNAME,
      }}
      containerStyle={{
        right: "20px",
        top: "auto",
        left: "auto",
        width: "100%",
        height: "100%",
        maxWidth: "280px",
        maxHeight: "67px",
        textAlign: "right",
      }}
    />
  );
}
