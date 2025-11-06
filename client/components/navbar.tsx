"use client"

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEmbeddedWallet } from "@dynamic-labs/sdk-react-core";

export default function Navbar() {
  const { primaryWallet, setShowAuthFlow, handleLogOut, user } = useDynamicContext();
  const { 
    createEmbeddedWallet, 
    isLoadingEmbeddedWallet,
    userHasEmbeddedWallet,
    isSessionActive
  } = useEmbeddedWallet();
  
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = !!primaryWallet;
  const walletAddress = primaryWallet?.address;

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectWallet = async () => {
    // If user is authenticated but no wallet connected, create embedded wallet headlessly
    if (user && !primaryWallet) {
      try {
        setIsLoading(true);
        // Create embedded wallet programmatically (headless)
        await createEmbeddedWallet();
      } catch (error) {
        console.error("Error creating wallet:", error);
        // If wallet creation fails, user might need to authenticate first
        setShowAuthFlow(true);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If user has embedded wallet but not connected, restore it
    if (userHasEmbeddedWallet() && isSessionActive && !primaryWallet) {
      try {
        setIsLoading(true);
        await createEmbeddedWallet();
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setShowAuthFlow(true);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If no user or no wallet, open auth flow for initial authentication
    // After auth, embedded wallet will be created automatically or can be created programmatically
    setShowAuthFlow(true);
  };

  const handleDisconnect = async () => {
    try {
      await handleLogOut();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  return (
    <nav className="w-full flex justify-center px-6 py-6">
      <div className="flex items-center justify-between w-full max-w-5xl px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-white/10">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shrink-0">
            <span className="text-red-900 font-bold text-xl">⚡</span>
          </div>
          <span className="text-black font-bold text-lg tracking-tight">DM Saas</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-12">
          <a href="#" className="text-black font-medium hover:text-gray-800 transition-colors duration-200">
            Home
          </a>
          <a href="#" className="text-black font-medium hover:text-gray-800 transition-colors duration-200">
            About
          </a>
          <a href="#" className="text-black font-medium hover:text-gray-800 transition-colors duration-200">
            Contact
          </a>
        </div>

        {/* Connect Wallet Button / Connected Wallet Address */}
        <div className="hidden md:block relative">
          {isConnected && walletAddress ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-black text-white font-semibold rounded-full text-sm">
                {formatAddress(walletAddress)}
              </div>
              <button
                onClick={handleDisconnect}
                className="px-3 py-2 bg-black text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-black/40 active:scale-95 flex items-center justify-center cursor-pointer"
                aria-label="Disconnect wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              disabled={isLoading || isLoadingEmbeddedWallet}
              className="px-8 py-3 bg-black text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-black/40 active:scale-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
