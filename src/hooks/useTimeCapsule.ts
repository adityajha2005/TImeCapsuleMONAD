'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import contractABI from '../lib/contractutils.json';
import contractAddressData from '../lib/contractAddress.json';

const CONTRACT_ADDRESS = contractAddressData.replace(/"/g, '') as `0x${string}`;

// Types for better TypeScript support
export interface Capsule {
  id: bigint;
  creator: string;
  recipient: string;
  unlockTime: bigint;
  encryptedURI: string;
  lockType: number;
  visibility: number;
  isOpened: boolean;
}

export enum LockType {
  TIME_BASED = 0,
  BLOCK_BASED = 1
}

export enum Visibility {
  PRIVATE = 0,
  PUBLIC = 1
}

// Read Hooks
export function useTimeCapsuleName() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'name',
  });
}

export function useTimeCapsuleSymbol() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'symbol',
  });
}

export function useBalanceOf(owner: string) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [owner],
    query: {
      enabled: !!owner,
    },
  });
}

export function useOwnerOf(tokenId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'ownerOf',
    args: [tokenId],
    query: {
      enabled: !!tokenId,
    },
  });
}

export function useGetOwnedCapsules(userAddress: string) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getOwnedCapsules',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });
}

export function useGetCapsuleURI(capsuleId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getCapsuleURI',
    args: [capsuleId],
    query: {
      enabled: !!capsuleId,
    },
  });
}

export function useGetCapsule(capsuleId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 's_capsules',
    args: [capsuleId],
    query: {
      enabled: !!capsuleId,
    },
  });
}

export function useTokenURI(tokenId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'tokenURI',
    args: [tokenId],
    query: {
      enabled: !!tokenId,
    },
  });
}

export function useGetApproved(tokenId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getApproved',
    args: [tokenId],
    query: {
      enabled: !!tokenId,
    },
  });
}

export function useIsApprovedForAll(owner: string, operator: string) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'isApprovedForAll',
    args: [owner, operator],
    query: {
      enabled: !!owner && !!operator,
    },
  });
}

// Write Hooks
export function useMintCapsule() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const mintCapsule = (
    encryptedURI: string,
    unlockValue: bigint,
    lockType: LockType,
    visibility: Visibility
  ) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'mintCapsule',
      args: [encryptedURI, unlockValue, lockType, visibility],
    });
  };

  return {
    mintCapsule,
    hash,
    error,
    isPending,
  };
}

export function useUnlockCapsule() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const unlockCapsule = (capsuleId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'unlockCapsule',
      args: [capsuleId],
    });
  };

  return {
    unlockCapsule,
    hash,
    error,
    isPending,
  };
}

export function useGiftCapsule() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const giftCapsule = (capsuleId: bigint, to: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'giftCapsule',
      args: [capsuleId, to],
    });
  };

  return {
    giftCapsule,
    hash,
    error,
    isPending,
  };
}

export function useSetCapsuleVisibility() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const setCapsuleVisibility = (capsuleId: bigint, visibility: Visibility) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'setCapsuleVisibility',
      args: [capsuleId, visibility],
    });
  };

  return {
    setCapsuleVisibility,
    hash,
    error,
    isPending,
  };
}

export function useApprove() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const approve = (to: string, tokenId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'approve',
      args: [to, tokenId],
    });
  };

  return {
    approve,
    hash,
    error,
    isPending,
  };
}

export function useSetApprovalForAll() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const setApprovalForAll = (operator: string, approved: boolean) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'setApprovalForAll',
      args: [operator, approved],
    });
  };

  return {
    setApprovalForAll,
    hash,
    error,
    isPending,
  };
}

export function useTransferFrom() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const transferFrom = (from: string, to: string, tokenId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'transferFrom',
      args: [from, to, tokenId],
    });
  };

  return {
    transferFrom,
    hash,
    error,
    isPending,
  };
}

export function useSafeTransferFrom() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const safeTransferFrom = (from: string, to: string, tokenId: bigint, data?: string) => {
    if (data) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'safeTransferFrom',
        args: [from, to, tokenId, data],
      });
    } else {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'safeTransferFrom',
        args: [from, to, tokenId],
      });
    }
  };

  return {
    safeTransferFrom,
    hash,
    error,
    isPending,
  };
}

// Transaction Receipt Hook
export function useTransactionReceipt(hash: `0x${string}` | undefined) {
  return useWaitForTransactionReceipt({
    hash,
  });
}

// Utility Functions
export function formatCapsuleData(capsuleData: any): Capsule | null {
  if (!capsuleData || capsuleData.length < 8) return null;
  
  return {
    id: capsuleData[0],
    creator: capsuleData[1],
    recipient: capsuleData[2],
    unlockTime: capsuleData[3],
    encryptedURI: capsuleData[4],
    lockType: capsuleData[5],
    visibility: capsuleData[6],
    isOpened: capsuleData[7],
  };
}

export function isUnlockable(capsule: Capsule): boolean {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return capsule.unlockTime <= now && !capsule.isOpened;
}

export function getTimeUntilUnlock(capsule: Capsule): number {
  const now = Math.floor(Date.now() / 1000);
  const unlockTime = Number(capsule.unlockTime);
  return Math.max(0, unlockTime - now);
}

// Contract Constants
export const TIMECAPSULE_CONTRACT = {
  address: CONTRACT_ADDRESS,
  abi: contractABI,
} as const; 