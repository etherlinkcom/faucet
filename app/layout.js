import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/react";
import FathomComponent from "./components/fathom";
import { Navbar } from "@/app/components/Navbar/index";

export const metadata = {
  title: "Get XTZ on Etherlink faucet | Etherlink",
  metadataBase: new URL("https://etherlink.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Analytics />
        <Navbar />
        <ClientLayout>
          <FathomComponent />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
