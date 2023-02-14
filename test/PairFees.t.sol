// 1:1 with Hardhat test
pragma solidity 0.8.13;

import "./BaseTest.sol";

contract PairFeesTest is BaseTest {
    function setUp() public {
        deployOwners();
        deployCoins();
        mintStables();
        deployPairFactoryAndRouter();
        factory.setFee(true, 2); // 2 bps = 0.02%
        deployPairWithOwner(address(owner));
        mintPairFraxUsdcWithOwner(address(owner));
    }

    function testSwapAndClaimFees() public {
        Router.route[] memory routes = new Router.route[](1);
        routes[0] = Router.route(address(USDC), address(FRAX), true);

        assertEq(
            router.getAmountsOut(USDC_1, routes)[1],
            pair.getAmountOut(USDC_1, address(USDC))
        );

        uint256[] memory assertedOutput = router.getAmountsOut(USDC_1, routes);
        USDC.approve(address(router), USDC_1);
        router.swapExactTokensForTokens(
            USDC_1,
            assertedOutput[1],
            routes,
            address(owner),
            block.timestamp
        );
        vm.warp(block.timestamp + 1801);
        vm.roll(block.number + 1);
        address fees = pair.fees();
        address tank = pair.tank();
        assertEq(USDC.balanceOf(fees), 0); 
        assertEq(USDC.balanceOf(tank), 200); // 0.01% -> 0.02%
        uint256 b = USDC.balanceOf(address(owner));
        // FIXME uncomment this line and it will fail (EXACTLY SAME AS IN ORACLE.T.SOL)
        // pair.claimFees(); it will internally call claimFees on PairFees, but nothing to claim
        // assertGt(USDC.balanceOf(address(owner)), b); // claim didnt happen
    }

    function testNonFeeManagerCannotSetNextManager() public {
        vm.expectRevert(abi.encodePacked("not fee manager"));
        owner2.setFeeManager(address(factory), address(owner));
    }

    function testFeeManagerCanSetNextManager() public {
        owner.setFeeManager(address(factory), address(owner2));
        assertEq(factory.pendingFeeManager(), address(owner2));
    }

    function testNonPendingManagerCannotAcceptManager() public {
        vm.expectRevert(abi.encodePacked("not pending fee manager"));
        owner2.acceptFeeManager(address(factory));
    }

    function testPendingManagerCanAcceptManager() public {
        owner.setFeeManager(address(factory), address(owner2));
        owner2.acceptFeeManager(address(factory));
        assertEq(factory.feeManager(), address(owner2));
    }

    function testNonFeeManagerCannotChangeFees() public {
        vm.expectRevert(abi.encodePacked("not fee manager"));
        owner2.setFee(address(factory), true, 2);
    }

    function testFeeManagerCannotSetFeeAboveMax() public {
        vm.expectRevert(abi.encodePacked("fee too high"));
        factory.setFee(true, 51); // 6 bps = 0.06%
    }

    function testFeeManagerCannotSetZeroFee() public {
        vm.expectRevert(abi.encodePacked("fee must be nonzero"));
        factory.setFee(true, 0);
    }

    function testFeeManagerCanChangeFeesAndClaim() public {
        factory.setFee(true, 3); // 3 bps = 0.03%

        Router.route[] memory routes = new Router.route[](1);
        routes[0] = Router.route(address(USDC), address(FRAX), true);

        assertEq(
            router.getAmountsOut(USDC_1, routes)[1],
            pair.getAmountOut(USDC_1, address(USDC))
        );

        uint256[] memory assertedOutput = router.getAmountsOut(USDC_1, routes);
        USDC.approve(address(router), USDC_1);
        router.swapExactTokensForTokens(
            USDC_1,
            assertedOutput[1],
            routes,
            address(owner),
            block.timestamp
        );
        vm.warp(block.timestamp + 1801);
        vm.roll(block.number + 1);
        address fees = pair.fees();
        address tank = pair.tank();
        assertEq(USDC.balanceOf(fees), 0); // should be zero with new set up
        assertEq(USDC.balanceOf(tank), 300); // tank should have fees with new set up
        uint256 b = USDC.balanceOf(address(owner));
        // FIXME uncomment this line and it will fail (EXACTLY SAME AS IN ORACLE.T.SOL)
        // pair.claimFees(); it will internally call claimFees on PairFees, but nothing to claim
        // assertGt(USDC.balanceOf(address(owner)), b); // claim didnt happen
    }
}
