import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/provider";
import { Toaster } from "react-hot-toast";

import { headers } from "next/headers"

import { cookieToInitialState } from "wagmi"

import { config } from "@/utils/config"
import Web3ModalProvider from "@/app/conectivity/web3context"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RVM Token",
  description: "RVM Token",
};

export default function RootLayout({ children }) {
  const initialState = cookieToInitialState(config, headers().get("cookie"))
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} overflow-x-hidden`}>
        <Toaster />
        <Providers>
          <Web3ModalProvider initialState={initialState}>
            {children}
          </Web3ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
