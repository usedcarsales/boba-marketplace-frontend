"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

interface ConnectWalletButtonProps {
  compact?: boolean;
}

export function ConnectWalletButton({ compact = false }: ConnectWalletButtonProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                type="button"
                className={`flex items-center gap-2 bg-boba-red hover:bg-boba-red/90 text-white font-semibold rounded-lg transition-colors ${
                  compact ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"
                }`}
              >
                <WalletIcon className="w-4 h-4" />
                {compact ? "Connect" : "Connect Wallet"}
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                type="button"
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg px-3 py-1.5 text-sm transition-colors"
              >
                ⚠️ Wrong Network
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                type="button"
                className={`flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-colors ${
                  compact ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"
                }`}
              >
                {account.ensName ? (
                  <span className="text-boba-red font-semibold">{account.ensName}</span>
                ) : (
                  <span className="font-mono text-xs">
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </span>
                )}
                <ChevronDownIcon className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
