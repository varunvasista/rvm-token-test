"use client"

import React from "react"
import { config, projectId } from "@/utils/config"

import { createWeb3Modal } from "@web3modal/wagmi/react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { WagmiProvider } from "wagmi"
import { ConectivityProvider } from "@/utils/utils"

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error("Project ID is not defined")

// Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
    themeMode: 'light',
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
})

export default function Web3ModalProvider({ children, initialState }) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <ConectivityProvider>
                    {children}
                </ConectivityProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
