# TimeCapsule Contract Integration Guide

## Overview
This guide documents the integration of TimeCapsule smart contract with the frontend application using Wagmi hooks and RainbowKit for wallet connectivity.

## Contract Details
- **Contract Address**: `0x994732208ce190cD5ED844E5a7b4007deC40396d`
- **Network**: Monad Testnet
- **Contract Type**: ERC721 NFT with time-locking functionality

## Integration Components

### 1. Contract Hooks (`src/hooks/useTimeCapsule.ts`)
Comprehensive React hooks for interacting with the TimeCapsule contract:

#### Read Hooks
- `useTimeCapsuleName()` - Get contract name
- `useTimeCapsuleSymbol()` - Get contract symbol
- `useBalanceOf(owner)` - Get NFT balance for an address
- `useGetOwnedCapsules(userAddress)` - Get all capsule IDs owned by user
- `useGetCapsule(capsuleId)` - Get detailed capsule data
- `useGetCapsuleURI(capsuleId)` - Get capsule metadata URI
- `useTokenURI(tokenId)` - Get token metadata URI

#### Write Hooks
- `useMintCapsule()` - Create new time capsules
- `useUnlockCapsule()` - Unlock time-locked capsules
- `useGiftCapsule()` - Transfer capsules to other users
- `useSetCapsuleVisibility()` - Change capsule privacy settings
- `useApprove()` - Approve address for specific token
- `useSetApprovalForAll()` - Set approval for all tokens

#### Utility Functions
- `formatCapsuleData()` - Format raw contract data
- `isUnlockable()` - Check if capsule can be unlocked
- `getTimeUntilUnlock()` - Calculate remaining lock time

### 2. Integrated Pages

#### Create Page (`src/app/(frontend)/create/page.tsx`)
- **Features**: Full capsule creation with contract integration
- **Wallet Connection**: Required before creating capsules
- **Transaction Handling**: Real-time transaction status and confirmation
- **Form Validation**: Ensures all required fields are filled
- **Success State**: Shows transaction hash and Monad explorer link

#### My Capsules Page (`src/app/(frontend)/my-capsule/page.tsx`)
- **Component**: Uses `CapsuleManager` component
- **Features**: View, unlock, and gift user's capsules
- **Real-time Data**: Fetches live data from blockchain
- **Transaction Status**: Shows success/error states for operations

### 3. CapsuleManager Component (`src/components/CapsuleManager.tsx`)
Comprehensive capsule management interface:
- **Stats Dashboard**: Total, locked, and unlocked capsule counts
- **Capsule Display**: Individual capsule cards with full details
- **Actions**: Unlock and gift functionality
- **Transaction Feedback**: Real-time transaction status
- **Empty State**: Guides users to create their first capsule

## Key Features

### Time-Locking Mechanism
- **Time-based**: Unlock at specific timestamp
- **Block-based**: Unlock at specific block number
- **Automatic Validation**: Contract enforces unlock conditions

### Privacy Controls
- **Private Capsules**: Only owner can view
- **Public Capsules**: Visible to all users
- **Changeable**: Owners can modify visibility

### NFT Functionality
- **ERC721 Standard**: Full NFT compatibility
- **Transferable**: Can be gifted to other users
- **Metadata**: Rich metadata stored on-chain

## Usage Examples

### Creating a Capsule
```typescript
const { mintCapsule, hash, isPending } = useMintCapsule();

const handleCreate = () => {
  const encryptedURI = "data:application/json;base64,...";
  const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 86400); // 24 hours
  const lockType = LockType.TIME_BASED;
  const visibility = Visibility.PRIVATE;
  
  mintCapsule(encryptedURI, unlockTime, lockType, visibility);
};
```

### Unlocking a Capsule
```typescript
const { unlockCapsule, isPending } = useUnlockCapsule();

const handleUnlock = (capsuleId: bigint) => {
  unlockCapsule(capsuleId);
};
```

### Viewing User's Capsules
```typescript
const { data: ownedCapsules } = useGetOwnedCapsules(address);
const { data: capsuleData } = useGetCapsule(capsuleId);
const formattedCapsule = formatCapsuleData(capsuleData);
```

## Transaction Handling

### Transaction States
- **Pending**: User needs to confirm in wallet
- **Loading**: Transaction submitted, waiting for confirmation
- **Success**: Transaction confirmed on blockchain
- **Error**: Transaction failed or rejected

### Error Handling
All hooks include comprehensive error handling:
```typescript
const { mintCapsule, hash, error, isPending } = useMintCapsule();

if (error) {
  console.error('Minting failed:', error.message);
}
```

## Network Configuration

### Wagmi Setup (`src/lib/config.ts`)
- **Chain**: Monad Testnet
- **Connectors**: MetaMask, Coinbase Wallet, Phantom
- **Storage**: Cookie-based for SSR compatibility

### Provider Setup (`src/components/ClientProviders.tsx`)
- **WagmiProvider**: Blockchain connectivity
- **QueryClientProvider**: Data fetching and caching
- **RainbowKitProvider**: Wallet UI components

## Testing

### Contract Verification
The contract has been verified and tested:
- ✅ Contract deployed and active on Monad testnet
- ✅ All functions accessible and working
- ✅ Events properly emitted
- ✅ NFT standard compliance

### Frontend Integration
- ✅ Wallet connection working
- ✅ Contract calls successful
- ✅ Transaction handling robust
- ✅ Error states handled
- ✅ Loading states implemented

## Future Enhancements

### Planned Features
1. **Batch Operations**: Unlock/gift multiple capsules
2. **Advanced Filtering**: Filter by date, type, status
3. **Capsule Search**: Search by content or metadata
4. **Social Features**: Like, comment, share capsules
5. **Analytics**: Usage statistics and insights

### Technical Improvements
1. **Optimistic Updates**: Immediate UI feedback
2. **Caching Strategy**: Better data management
3. **Pagination**: Handle large capsule collections
4. **Real-time Updates**: WebSocket integration
5. **Mobile Optimization**: Responsive design improvements

## Troubleshooting

### Common Issues
1. **Wallet Not Connected**: Ensure wallet is connected to Monad testnet
2. **Transaction Fails**: Check gas fees and network congestion
3. **Capsule Not Unlockable**: Verify unlock time has passed
4. **Data Not Loading**: Check network connection and RPC status

### Debug Tools
- **Monad Explorer**: View transactions and contract state at https://testnet.monadexplorer.com
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API calls and responses
- **Wagmi DevTools**: Debug hook states and data

## Support
For issues or questions:
1. Check the troubleshooting section
2. Review contract documentation
3. Test on Monad testnet first
4. Verify wallet connectivity

---

*Last updated: December 2024* 