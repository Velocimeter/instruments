pragma solidity 0.8.13;

import {Base64} from "contracts/libraries/Base64.sol";
import {IVeArtProxy} from "contracts/interfaces/IVeArtProxy.sol";
import "openzeppelin-contracts/contracts/utils/math/Math.sol";

contract VeArtProxy is IVeArtProxy {
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function humanize(uint256 value) public pure returns (string memory) {
        if (value < 1000) {
            return toString(value);
        }
        uint256 exp = Math.min(Math.log10(value) / 3, 5);
        string[6] memory units = ["k", "M", "B", "T", "Q", "QQ"];
        uint256 scaled = value / (10 ** (exp * 3));
        return string(abi.encodePacked(toString(scaled), units[exp - 1]));
    }

    function _tokenURI(uint256 _tokenId, uint256 _balanceOf, uint256 _lockedEnd, uint256 _value)
        external
        pure
        returns (string memory output)
    {
        output =
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        output =
            string(abi.encodePacked(output, "token ", toString(_tokenId), '</text><text x="10" y="40" class="base">'));
        output = string(
            abi.encodePacked(output, "balanceOf ", humanize(_balanceOf), '</text><text x="10" y="60" class="base">')
        );
        output = string(
            abi.encodePacked(output, "lockedEnd ", humanize(_lockedEnd), '</text><text x="10" y="80" class="base">')
        );
        output = string(abi.encodePacked(output, "value ", humanize(_value), "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "lock #',
                        toString(_tokenId),
                        '", "description": "Velocimeter locks, can be used to boost gauge yields, vote on token emission, and receive bribes", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(abi.encodePacked("data:application/json;base64,", json));
    }
}
