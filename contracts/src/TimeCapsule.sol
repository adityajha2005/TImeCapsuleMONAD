// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TimeCapsule is ERC721, Ownable {
    uint256 private s_capsuleId = 0;

    enum LockType {
        BLOCK_NUMBER,
        TIMESTAMP
    }

    enum Visibility {
        PUBLIC,
        PRIVATE,
        PARTIAL
    }

    struct Capsule {
        uint256 id;
        address creator;
        address recipient;
        uint256 unlockTime;
        string encryptedURI;
        LockType lockType;
        Visibility visibility;
        bool isOpened;
    }

    mapping(uint256 => Capsule) public s_capsules;
    mapping(address => uint256[]) public ownedCapsules;

    event CapsuleMinted(
        uint256 indexed capsuleId,
        address indexed creator,
        address indexed recipient,
        uint256 lockTime,
        string encryptedURI,
        LockType lockType
    );
    event CapsuleRevealed(uint256 indexed capsuleId);
    event CapsuleGifted(address indexed from, address indexed to, uint256 indexed capsuleId);

    constructor() ERC721("TimeCapsule", "TC") Ownable(msg.sender) {}

    function mintCapsule(
        string memory encryptedURI,
        uint256 unlockValue,
        LockType lockType,
        Visibility visibility
    ) external returns (uint256) {
        require(visibility != Visibility.PARTIAL, "Cannot mint with PARTIAL visibility");
        if (lockType == LockType.BLOCK_NUMBER) {
            require(unlockValue > block.number, "Unlock block must be in the future");
        } else {
            require(unlockValue > block.timestamp, "Unlock time must be in the future");
        }

        s_capsuleId += 1;
        uint256 capsuleId = s_capsuleId;
        _mint(msg.sender, capsuleId);

        s_capsules[capsuleId] = Capsule({
            id: capsuleId,
            creator: msg.sender,
            recipient: msg.sender,
            unlockTime: unlockValue,
            encryptedURI: encryptedURI,
            lockType: lockType,
            visibility: visibility,
            isOpened: false
        });

        ownedCapsules[msg.sender].push(capsuleId);

        emit CapsuleMinted(capsuleId, msg.sender, msg.sender, unlockValue, encryptedURI, lockType);
        return capsuleId;
    }

    function canReveal(uint256 capsuleId) internal view returns (bool) {
        require(capsuleId > 0 && capsuleId <= s_capsuleId, "Token does not exist");
        if (s_capsules[capsuleId].visibility == Visibility.PRIVATE || s_capsules[capsuleId].visibility == Visibility.PARTIAL) {
            require(s_capsules[capsuleId].creator == msg.sender || s_capsules[capsuleId].recipient == msg.sender, "Not authorized");
        }

        Capsule memory cap = s_capsules[capsuleId];
        if (cap.lockType == LockType.BLOCK_NUMBER) {
            return block.number >= cap.unlockTime && !cap.isOpened;
        } else {
            return block.timestamp >= cap.unlockTime && !cap.isOpened;
        }
    }

    function unlockCapsule(uint256 capsuleId) external {
        require(ownerOf(capsuleId) == msg.sender || s_capsules[capsuleId].recipient == msg.sender, "Not owner or recipient");
        require(canReveal(capsuleId), "Capsule not ready");

        s_capsules[capsuleId].isOpened = true;
        emit CapsuleRevealed(capsuleId);
    }

    function giftCapsule(uint256 capsuleId, address to) external {
        require(capsuleId > 0 && capsuleId <= s_capsuleId, "Capsule does not exist");
        require(ownerOf(capsuleId) == msg.sender, "Only owner can gift");

        _transfer(msg.sender, to, capsuleId);
        s_capsules[capsuleId].recipient = to;
        s_capsules[capsuleId].visibility = Visibility.PARTIAL;

        uint256[] storage senderCapsules = ownedCapsules[msg.sender];
        for (uint256 i = 0; i < senderCapsules.length; i++) {
            if (senderCapsules[i] == capsuleId) {
                senderCapsules[i] = senderCapsules[senderCapsules.length - 1];
                senderCapsules.pop();
                break;
            }
        }
        ownedCapsules[to].push(capsuleId);
        emit CapsuleGifted(msg.sender, to, capsuleId);
    }

    function setCapsuleVisibility(uint256 capsuleId, Visibility visibility) external {
        require(ownerOf(capsuleId) == msg.sender || s_capsules[capsuleId].recipient == msg.sender, "Not authorized");
        require(visibility != Visibility.PARTIAL, "Cannot manually set PARTIAL visibility");
        s_capsules[capsuleId].visibility = visibility;
    }

    function getCapsuleURI(uint256 capsuleId) public view returns (string memory) {
        require(capsuleId > 0 && capsuleId <= s_capsuleId, "Capsule does not exist");

        Capsule memory cap = s_capsules[capsuleId];

        if (cap.visibility == Visibility.PRIVATE && msg.sender != cap.creator && msg.sender != cap.recipient) {
            return "This capsule is private.";
        }

        if (cap.visibility == Visibility.PARTIAL) {
            if (msg.sender != cap.creator && msg.sender != cap.recipient) {
                return "This capsule is only visible to creator and recipient.";
            }
            if (!cap.isOpened) {
                return "Capsule is still locked.";
            }
            return cap.encryptedURI;
        }

        if (canReveal(capsuleId)) {
            return cap.encryptedURI;
        } else {
            return "Capsule is still locked.";
        }
    }

    function getOwnedCapsules(address user) external view returns (uint256[] memory) {
        return ownedCapsules[user];
    }
}