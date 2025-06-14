// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TimeCapsule} from "../src/TimeCapsule.sol";

contract TimeCapsuleScript is Script {
    TimeCapsule public timeCapsule;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        timeCapsule = new TimeCapsule();

        vm.stopBroadcast();
    }
}
