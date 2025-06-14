// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {TimeCapsule} from "../src/TimeCapsule.sol";

contract TimeCapsuleTest is Test {
    TimeCapsule public timeCapsule;
    address public owner;
    address public alice;
    address public bob;

    function setUp() public {
        owner = address(this);
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        timeCapsule = new TimeCapsule();

        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
    }

    function test_MintCapsuleWithBlockNumber() public {
        vm.startPrank(alice);
        uint256 unlockBlock = block.number + 100;
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            unlockBlock,
            TimeCapsule.LockType.BLOCK_NUMBER,
            TimeCapsule.Visibility.PUBLIC
        );

        assertEq(timeCapsule.ownerOf(capsuleId), alice);
        (
            uint256 id,
            address creator,
            address recipient,
            uint256 unlockTime,
            string memory uri,
            TimeCapsule.LockType lockType,
            TimeCapsule.Visibility visibility,
            bool isOpened
        ) = timeCapsule.s_capsules(capsuleId);

        assertEq(id, capsuleId);
        assertEq(creator, alice);
        assertEq(recipient, alice);
        assertEq(unlockTime, unlockBlock);
        assertEq(uri, "ipfs://test-uri");
        assertEq(uint(lockType), uint(TimeCapsule.LockType.BLOCK_NUMBER));
        assertEq(uint(visibility), uint(TimeCapsule.Visibility.PUBLIC));
        assertEq(isOpened, false);
        vm.stopPrank();
    }

    function test_MintCapsuleWithTimestamp() public {
        vm.startPrank(alice);
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            unlockTime,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );

        assertEq(timeCapsule.ownerOf(capsuleId), alice);
        (
            ,
            ,
            ,
            uint256 storedUnlockTime,
            ,
            TimeCapsule.LockType lockType,
            ,
            
        ) = timeCapsule.s_capsules(capsuleId);

        assertEq(storedUnlockTime, unlockTime);
        assertEq(uint(lockType), uint(TimeCapsule.LockType.TIMESTAMP));
        vm.stopPrank();
    }

    function test_RevertWhenMintingWithPastBlockNumber() public {
        vm.startPrank(alice);
        uint256 pastBlock = block.number - 1;
        vm.expectRevert("Unlock block must be in the future");
        timeCapsule.mintCapsule(
            "ipfs://test-uri",
            pastBlock,
            TimeCapsule.LockType.BLOCK_NUMBER,
            TimeCapsule.Visibility.PUBLIC
        );
        vm.stopPrank();
    }

    function test_UnlockCapsuleWithBlockNumber() public {
        vm.startPrank(alice);
        uint256 unlockBlock = block.number + 100;
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            unlockBlock,
            TimeCapsule.LockType.BLOCK_NUMBER,
            TimeCapsule.Visibility.PUBLIC
        );

        vm.roll(unlockBlock + 1);
        timeCapsule.unlockCapsule(capsuleId);

        (, , , , , , , bool isOpened) = timeCapsule.s_capsules(capsuleId);
        assertTrue(isOpened);
        vm.stopPrank();
    }

    function test_GiftCapsule() public {
        vm.startPrank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );

        timeCapsule.giftCapsule(capsuleId, bob);
        vm.stopPrank();

        assertEq(timeCapsule.ownerOf(capsuleId), bob);
        (, , address recipient, , , , , ) = timeCapsule.s_capsules(capsuleId);
        assertEq(recipient, bob);
    }

    function test_CapsuleVisibilityAccess() public {
        vm.startPrank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PRIVATE
        );
        vm.stopPrank();

        // Bob shouldn't be able to see private capsule
        vm.prank(bob);
        assertEq(timeCapsule.getCapsuleURI(capsuleId), "This capsule is private.");

        // Alice should see the locked message
        vm.prank(alice);
        assertEq(timeCapsule.getCapsuleURI(capsuleId), "Capsule is still locked.");

        // Change visibility to public
        vm.prank(alice);
        timeCapsule.setCapsuleVisibility(capsuleId, TimeCapsule.Visibility.PUBLIC);

        // Now Bob should see the locked message
        vm.prank(bob);
        assertEq(timeCapsule.getCapsuleURI(capsuleId), "Capsule is still locked.");
    }

    function test_GetOwnedCapsules() public {
        vm.startPrank(alice);
        uint256 capsuleId1 = timeCapsule.mintCapsule(
            "ipfs://test-uri-1",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        uint256 capsuleId2 = timeCapsule.mintCapsule(
            "ipfs://test-uri-2",
            block.timestamp + 2 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        vm.stopPrank();

        uint256[] memory aliceCapsules = timeCapsule.getOwnedCapsules(alice);
        assertEq(aliceCapsules.length, 2);
        assertEq(aliceCapsules[0], capsuleId1);
        assertEq(aliceCapsules[1], capsuleId2);
    }

    function test_RevertUnauthorizedUnlock() public {
        vm.prank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );

        vm.prank(bob);
        vm.expectRevert("Not owner or recipient");
        timeCapsule.unlockCapsule(capsuleId);
    }

    function test_RevertWhenMintingWithPastTimestamp() public {
        vm.startPrank(alice);
        // Set timestamp to 2 hours from now
        uint256 currentTime = 3600 * 2;  // 2 hours in seconds
        vm.warp(currentTime);
        // Try to mint with a timestamp 1 hour ago
        uint256 pastTime = currentTime - 3600;  // subtract 1 hour in seconds
        vm.expectRevert("Unlock time must be in the future");
        timeCapsule.mintCapsule(
            "ipfs://test-uri",
            pastTime,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        vm.stopPrank();
    }

    function test_UnlockCapsuleWithTimestamp() public {
        vm.startPrank(alice);
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            unlockTime,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );

        // Warp to unlock time
        vm.warp(unlockTime + 1);
        timeCapsule.unlockCapsule(capsuleId);

        (, , , , , , , bool isOpened) = timeCapsule.s_capsules(capsuleId);
        assertTrue(isOpened);
        vm.stopPrank();
    }

    function test_RevertUnlockBeforeTime() public {
        vm.startPrank(alice);
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            unlockTime,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );

        // Try to unlock before time
        vm.expectRevert("Capsule not ready");
        timeCapsule.unlockCapsule(capsuleId);
        vm.stopPrank();
    }

    function test_CannotMintWithPartialVisibility() public {
        vm.startPrank(alice);
        vm.expectRevert("Cannot mint with PARTIAL visibility");
        timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PARTIAL
        );
        vm.stopPrank();
    }

    function test_CannotManuallySetPartialVisibility() public {
        vm.startPrank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        
        vm.expectRevert("Cannot manually set PARTIAL visibility");
        timeCapsule.setCapsuleVisibility(capsuleId, TimeCapsule.Visibility.PARTIAL);
        vm.stopPrank();
    }

    function test_GiftAutomaticallySetsPartialVisibility() public {
        // Alice creates and gifts a capsule to Bob
        vm.startPrank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        timeCapsule.giftCapsule(capsuleId, bob);
        vm.stopPrank();

        // Check that visibility is automatically set to PARTIAL
        (, , , , , , TimeCapsule.Visibility visibility, ) = timeCapsule.s_capsules(capsuleId);
        assertEq(uint(visibility), uint(TimeCapsule.Visibility.PARTIAL));
    }

    function test_PartialVisibilityAccess() public {
        // Alice creates and gifts a capsule to Bob
        vm.startPrank(alice);
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            unlockTime,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        timeCapsule.giftCapsule(capsuleId, bob);
        vm.stopPrank();

        // Test that only creator (Alice) and recipient (Bob) can see the capsule
        vm.prank(owner);  // Third party
        assertEq(
            timeCapsule.getCapsuleURI(capsuleId),
            "This capsule is only visible to creator and recipient."
        );

        // Creator (Alice) should see locked message before unlock
        vm.prank(alice);
        assertEq(timeCapsule.getCapsuleURI(capsuleId), "Capsule is still locked.");

        // Recipient (Bob) should see locked message before unlock
        vm.prank(bob);
        assertEq(timeCapsule.getCapsuleURI(capsuleId), "Capsule is still locked.");

        // Warp to unlock time and unlock
        vm.warp(unlockTime + 1);
        vm.prank(bob);
        timeCapsule.unlockCapsule(capsuleId);

        // After unlock, both creator and recipient should see the URI
        vm.prank(alice);
        assertEq(timeCapsule.getCapsuleURI(capsuleId), "ipfs://test-uri");

        vm.prank(bob);
        assertEq(timeCapsule.getCapsuleURI(capsuleId), "ipfs://test-uri");

        // Third party still cannot see
        vm.prank(owner);
        assertEq(
            timeCapsule.getCapsuleURI(capsuleId),
            "This capsule is only visible to creator and recipient."
        );
    }

    function test_RevertGiftingUnownedCapsule() public {
        vm.startPrank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert("Only owner can gift");
        timeCapsule.giftCapsule(capsuleId, alice);
        vm.stopPrank();
    }

    function test_ChangeVisibilityUnauthorized() public {
        vm.startPrank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        vm.stopPrank();

        vm.startPrank(bob);
        vm.expectRevert("Not authorized");
        timeCapsule.setCapsuleVisibility(capsuleId, TimeCapsule.Visibility.PRIVATE);
        vm.stopPrank();
    }

    function test_RecipientCanUnlock() public {
        // Alice creates and gifts a capsule to Bob
        vm.startPrank(alice);
        uint256 unlockTime = block.timestamp + 1 days;
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            unlockTime,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        timeCapsule.giftCapsule(capsuleId, bob);
        vm.stopPrank();

        // Warp to unlock time
        vm.warp(unlockTime + 1);

        // Bob should be able to unlock as recipient
        vm.startPrank(bob);
        timeCapsule.unlockCapsule(capsuleId);
        (, , , , , , , bool isOpened) = timeCapsule.s_capsules(capsuleId);
        assertTrue(isOpened);
        vm.stopPrank();
    }

    function test_NonexistentCapsuleURI() public {
        vm.expectRevert("Capsule does not exist");
        timeCapsule.getCapsuleURI(999);
    }

    function test_MultipleGifts() public {
        // Alice mints and gifts to Bob
        vm.startPrank(alice);
        uint256 capsuleId = timeCapsule.mintCapsule(
            "ipfs://test-uri",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        timeCapsule.giftCapsule(capsuleId, bob);
        vm.stopPrank();

        // Bob gifts to owner
        vm.startPrank(bob);
        timeCapsule.giftCapsule(capsuleId, owner);
        vm.stopPrank();

        // Verify final ownership and recipient
        assertEq(timeCapsule.ownerOf(capsuleId), owner);
        (, , address recipient, , , , , ) = timeCapsule.s_capsules(capsuleId);
        assertEq(recipient, owner);

        // Check Bob's owned capsules are updated
        uint256[] memory bobCapsules = timeCapsule.getOwnedCapsules(bob);
        assertEq(bobCapsules.length, 0);
    }

    function testGetAllCapsules() public {
        // Arrange: create some capsules
        timeCapsule.mintCapsule(
            "ipfs://capsule1",
            block.timestamp + 1 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );
        timeCapsule.mintCapsule(
            "ipfs://capsule2",
            block.timestamp + 2 days,
            TimeCapsule.LockType.TIMESTAMP,
            TimeCapsule.Visibility.PUBLIC
        );

        // Act: get all capsules
        TimeCapsule.Capsule[] memory capsules = timeCapsule.getAllCapsules();

        // Assert: check length and content
        assertEq(capsules.length, 2);
        // assertEq(capsules[0].uri, "ipfs://capsule1");
        // assertEq(capsules[1].uri, "ipfs://capsule2");
    }
}