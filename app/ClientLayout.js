"use client"

import { ThemeProvider } from "next-themes";
import { FaucetProvider } from "./contexts/FaucetContext";
import "../public/css/tailwind.css";
import { ThirdwebProvider } from "thirdweb/react";

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <FaucetProvider>
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </FaucetProvider>
    </ThemeProvider>
  );
}
