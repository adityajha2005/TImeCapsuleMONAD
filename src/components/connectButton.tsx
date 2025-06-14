"use client";
import { useEffect, useRef, useState } from "react";
import {
  WalletButton,

  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";


export const ConnectBtn = () => {
  const { isConnecting, isConnected, chain } = useAccount();
 
  const { openChainModal } = useChainModal();
  const { disconnect } = useDisconnect();
  const isMounted = useRef(false);
  const [showWallets, setShowWallets] = useState(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  if (!isConnected) {
    if (!showWallets) {
      return (
        <button
          onClick={() => setShowWallets(true)}
          disabled={isConnecting}
          className="
            relative overflow-hidden
            
            px-4 py-2  
            bg-black border-1 border-cyan-400 
            text-white text-sm
            rounded-lg 
            transition-all duration-300 ease-out
            hover:bg-cyan-400 hover:text-black 
            hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-black disabled:hover:text-white
            before:absolute before:inset-0 
            before:bg-gradient-to-r before:from-transparent before:via-cyan-400/20 before:to-transparent
            before:translate-x-[-100%] before:transition-transform before:duration-500
            hover:before:translate-x-[100%]
          "
        >
          {isConnecting ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              Connecting...
            </div>
          ) : (
            "Connect Wallet"
          )}
        </button>
      );
    }

    return (
      <div className="relative">
        <div className="flex absolute  top-8 flex-col gap-2 p-4 bg-stone-900/95 border-2 border-cyan-400/60 rounded-lg backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text font-semibold text-sm">Choose Wallet</h3>
            <button
              onClick={() => setShowWallets(false)}
              disabled={isConnecting}
              className="text-cyan-400 hover:text-white transition-colors text-lg leading-none disabled:opacity-50"
            >
              ×
            </button>
          </div>
          
          {/* MetaMask */}
          <WalletButton.Custom wallet="metaMask">
            {({ ready, connect }) => (
              <button
                type="button"
                disabled={!ready || isConnecting}
                onClick={connect}
                className="
                  relative overflow-hidden
                  w-full px-3 py-2 
                  bg-black border border-cyan-400/40 
                  text-white font-medium text-sm
                  rounded-md 
                  transition-all duration-300 ease-out
                  hover:bg-cyan-400 hover:text-black hover:border-cyan-400
                  hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:bg-black disabled:hover:text-cyan-400
                  flex items-center justify-center gap-2
                "
              >
                {isConnecting ? (
                  <>
                    <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <span>🦊</span>
                    MetaMask
                  </>
                )}
              </button>
            )}
          </WalletButton.Custom>

          {/* Coinbase Wallet */}
          <WalletButton.Custom wallet="coinbase">
            {({ ready, connect }) => (
              <button
                type="button"
                disabled={!ready || isConnecting}
                onClick={connect}
                className="
                  relative overflow-hidden
                  w-full px-3 py-2 
                  bg-black border border-cyan-400/40 
                  text-white font-medium text-sm
                  rounded-md 
                  transition-all duration-300 ease-out
                  hover:bg-cyan-400 hover:text-black hover:border-cyan-400
                  hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:bg-black disabled:hover:text-cyan-400
                  flex items-center justify-center gap-2
                "
              >
                {isConnecting ? (
                  <>
                    <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <span>🔵</span>
                    Coinbase
                  </>
                )}
              </button>
            )}
          </WalletButton.Custom>

          {/* Phantom Wallet */}
          <WalletButton.Custom wallet="phantom">
            {({ ready, connect }) => (
              <button
                type="button"
                disabled={!ready || isConnecting}
                onClick={connect}
                className="
                  relative overflow-hidden
                  w-full px-3 py-2 
                  bg-black border border-cyan-400/40 
                  text-white font-medium text-sm
                  rounded-md 
                  transition-all duration-300 ease-out
                  hover:bg-cyan-400 hover:text-black hover:border-cyan-400
                  hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:bg-black disabled:hover:text-cyan-400
                  flex items-center justify-center gap-2
                "
              >
                {isConnecting ? (
                  <>
                    <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <span>👻</span>
                    Phantom
                  </>
                )}
              </button>
            )}
          </WalletButton.Custom>
        </div>
      </div>
    );
  }

  if (isConnected && !chain) {
    return (
      <button 
        className="
          px-4 py-2 
          bg-red-600 border-2 border-red-400 
          text-white text-sm 
          rounded-lg 
          transition-all duration-300
          hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]
        " 
        onClick={openChainModal}
      >
        Wrong network
      </button>
    );
  }

  return (
    <div className="max-w-5xl w-full flex items-center justify-between gap-4">
     
      
      <div className="flex gap-3">
       
        
        <button 
          className="
            px-4 py-2 
            bg-gradient-to-r from-red-900 to-red-800 
            border-1 border-red-400/60 
            text-white text-sm  
            rounded-lg 
            transition-all duration-300 ease-out
            hover:border-red-400 
            hover:shadow-[0_0_20px_rgba(248,113,113,0.4)]
            hover:from-red-800 hover:to-red-900
            active:scale-95
          " 
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};