'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Clock, Lock, Unlock, Eye, MessageSquare, Zap, Target, Image } from 'lucide-react';
import {
  useGetOwnedCapsules,
  useGetCapsule,
  useUnlockCapsule,
  useGiftCapsule,
  useTransactionReceipt,
  formatCapsuleData,
  isUnlockable,
  getTimeUntilUnlock,
  type Capsule,
} from '@/hooks/useTimeCapsule';

interface CapsuleDisplayProps {
  capsule: Capsule;
  onUnlock: (id: bigint) => void;
  onGift: (id: bigint, recipient: string) => void;
  isUnlocking?: boolean;
}

const CapsuleDisplay: React.FC<CapsuleDisplayProps> = ({ 
  capsule, 
  onUnlock, 
  onGift, 
  isUnlocking = false 
}) => {
  const [giftRecipient, setGiftRecipient] = useState('');
  const [showGiftInput, setShowGiftInput] = useState(false);

  const getTypeIcon = (type: number) => {
    switch (type) {
      case 0: return MessageSquare;
      case 1: return Target;
      case 2: return Image;
      case 3: return Lock;
      default: return MessageSquare;
    }
  };

  const getTypeLabel = (type: number) => {
    switch (type) {
      case 0: return 'Message';
      case 1: return 'Prediction';
      case 2: return 'Art';
      case 3: return 'Secret';
      default: return 'Unknown';
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Ready to unlock!';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const TypeIcon = getTypeIcon(capsule.lockType);
  const canUnlock = isUnlockable(capsule);
  const timeRemaining = getTimeUntilUnlock(capsule);

  const handleGift = () => {
    if (giftRecipient.trim()) {
      onGift(capsule.id, giftRecipient);
      setGiftRecipient('');
      setShowGiftInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            capsule.isOpened ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">
              Capsule #{capsule.id.toString()}
            </h3>
            <p className="text-gray-400 text-sm">{getTypeLabel(capsule.lockType)}</p>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${
          capsule.isOpened ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {capsule.isOpened ? (
            <Unlock className="w-5 h-5 text-green-400" />
          ) : (
            <Lock className="w-5 h-5 text-red-400" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-gray-400">Creator</p>
          <p className="text-white font-mono text-sm">{capsule.creator}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Recipient</p>
          <p className="text-white font-mono text-sm">{capsule.recipient}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Status</p>
          <p className={`text-sm font-medium ${
            capsule.isOpened ? 'text-green-400' : 'text-red-400'
          }`}>
            {capsule.isOpened ? 'Unlocked' : 'Locked'}
          </p>
        </div>
        {!capsule.isOpened && (
          <div>
            <p className="text-sm text-gray-400">Time Remaining</p>
            <p className="text-cyan-400 font-medium">
              {formatTimeRemaining(timeRemaining)}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-400">Visibility</p>
          <p className="text-white text-sm">
            {capsule.visibility === 0 ? 'Private' : 'Public'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {!capsule.isOpened && canUnlock && (
          <button
            onClick={() => onUnlock(capsule.id)}
            disabled={isUnlocking}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {isUnlocking ? 'Unlocking...' : 'Unlock Capsule'}
          </button>
        )}
        
        {capsule.isOpened && (
          <button
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 inline mr-2" />
            View Content
          </button>
        )}

        <div className="flex gap-2">
          {!showGiftInput ? (
            <button
              onClick={() => setShowGiftInput(true)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Gift Capsule
            </button>
          ) : (
            <>
              <input
                type="text"
                value={giftRecipient}
                onChange={(e) => setGiftRecipient(e.target.value)}
                placeholder="Recipient address"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              />
              <button
                onClick={handleGift}
                disabled={!giftRecipient.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setShowGiftInput(false);
                  setGiftRecipient('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CapsuleManager: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [selectedCapsules, setSelectedCapsules] = useState<bigint[]>([]);

  // Contract hooks
  const { data: ownedCapsuleIds, isLoading: isLoadingCapsules } = useGetOwnedCapsules(address || '');
  const { unlockCapsule, hash: unlockHash, isPending: isUnlocking } = useUnlockCapsule();
  const { giftCapsule, hash: giftHash, isPending: isGifting } = useGiftCapsule();
  
  // Transaction receipts
  const { isLoading: isUnlockLoading, isSuccess: isUnlockSuccess } = useTransactionReceipt(unlockHash);
  const { isLoading: isGiftLoading, isSuccess: isGiftSuccess } = useTransactionReceipt(giftHash);

  // Get capsule data for first few capsules (for demo)
  const capsuleIds = Array.isArray(ownedCapsuleIds) ? ownedCapsuleIds : [];
  const { data: capsule1Data } = useGetCapsule(capsuleIds[0] || BigInt(0));
  const { data: capsule2Data } = useGetCapsule(capsuleIds[1] || BigInt(0));
  const { data: capsule3Data } = useGetCapsule(capsuleIds[2] || BigInt(0));

  const capsules = [capsule1Data, capsule2Data, capsule3Data]
    .filter(Boolean)
    .map(formatCapsuleData)
    .filter((capsule): capsule is Capsule => capsule !== null);

  const handleUnlock = (capsuleId: bigint) => {
    unlockCapsule(capsuleId);
  };

  const handleGift = (capsuleId: bigint, recipient: string) => {
    giftCapsule(capsuleId, recipient);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black pt-12 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-8">
            Connect Your Wallet
          </h1>
          <p className="text-gray-400 mb-8">Connect your wallet to manage your time capsules</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-12 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-4">
            My Time Capsules
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your on-chain time capsules
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Total Capsules</h3>
            <p className="text-3xl font-bold text-white">
              {Array.isArray(ownedCapsuleIds) ? ownedCapsuleIds.length : 0}
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Unlocked</h3>
            <p className="text-3xl font-bold text-white">
              {capsules.filter(c => c.isOpened).length}
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Locked</h3>
            <p className="text-3xl font-bold text-white">
              {capsules.filter(c => !c.isOpened).length}
            </p>
          </div>
        </div>

        {/* Transaction Status */}
        {(isUnlockSuccess || isGiftSuccess) && (
          <div className="mb-6">
            {isUnlockSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-400">✅ Capsule unlocked successfully!</p>
                {unlockHash && (
                  <a 
                    href={`https://testnet.monadexplorer.com/tx/${unlockHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 text-sm"
                  >
                    View transaction →
                  </a>
                )}
              </div>
            )}
            {isGiftSuccess && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                <p className="text-purple-400">✅ Capsule gifted successfully!</p>
                {giftHash && (
                  <a 
                    href={`https://explorer.monad.xyz/tx/${giftHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-200 text-sm"
                  >
                    View transaction →
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoadingCapsules && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading your capsules...</p>
          </div>
        )}

        {/* Capsules Grid */}
        {capsules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsules.map((capsule, index) => (
              <CapsuleDisplay
                key={capsule.id.toString()}
                capsule={capsule}
                onUnlock={handleUnlock}
                onGift={handleGift}
                isUnlocking={isUnlocking || isUnlockLoading}
              />
            ))}
          </div>
        ) : !isLoadingCapsules ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-4">No Capsules Found</h3>
            <p className="text-gray-500 mb-8">You haven't created any time capsules yet.</p>
            <button
              onClick={() => window.location.href = '/create'}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create Your First Capsule
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CapsuleManager; 