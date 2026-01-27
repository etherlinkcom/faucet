"use client"

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { FaucetProvider } from "./contexts/FaucetContext";
import "../public/css/tailwind.css";
import { ThirdwebProvider } from "thirdweb/react";

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <FaucetProvider>
        <Toaster />
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </FaucetProvider>
    </ThemeProvider>
  );
}
