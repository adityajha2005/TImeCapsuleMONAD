/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  phantomWallet,
  metaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http, fallback, createStorage, cookieStorage } from 'wagmi';
import {  monadTestnet } from 'wagmi/chains';
import { Chain } from '@rainbow-me/rainbowkit';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '';
const supportedChains: Chain[] = [monadTestnet

];

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        phantomWallet,
      ],
    },
  ],
  {
    appName: 'WalletConnection',
    projectId,
  }
);

export const config = createConfig({
  connectors,
  ssr: true,
//   @ts-ignore
  chains: supportedChains,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce((obj, chain) => ({ 
    ...obj, 
    [chain.id]: fallback([http()]) 
  }), {}),
});