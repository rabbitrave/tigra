// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TigraToken.sol";

contract RoyaltyEngine is Ownable {
    struct Split {
        address recipient;
        uint96 bps; // basis points (10000 = 100%)
    }

    TigraToken public tigraToken;

    // assetId -> splits
    mapping(uint256 => Split[]) public assetSplits;

    event SplitsSet(uint256 indexed assetId, Split[] splits);
    event RoyaltiesDistributed(uint256 indexed assetId, uint256 amount);

    constructor(address _tigraToken) {
        tigraToken = TigraToken(_tigraToken);
    }

    function setSplits(
        uint256 assetId,
        address[] calldata recipients,
        uint96[] calldata bps
    ) external onlyOwner {
        require(recipients.length == bps.length, "Length mismatch");

        delete assetSplits[assetId];
        uint256 totalBps;

        for (uint256 i = 0; i < recipients.length; i++) {
            assetSplits[assetId].push(Split({
                recipient: recipients[i],
                bps: bps[i]
            }));
            totalBps += bps[i];
        }

        require(totalBps == 10000, "Total bps must be 10000");

        emit SplitsSet(assetId, assetSplits[assetId]);
    }

    function distribute(uint256 assetId, uint256 amount) external {
        Split[] memory splits = assetSplits[assetId];
        require(splits.length > 0, "No splits");

        // Caller must have approved this contract to spend `amount` TIGRA
        require(
            tigraToken.transferFrom(msg.sender, address(this), amount),
            "Transfer in failed"
        );

        for (uint256 i = 0; i < splits.length; i++) {
            uint256 share = (amount * splits[i].bps) / 10000;
            require(
                tigraToken.transfer(splits[i].recipient, share),
                "Transfer out failed"
            );
        }

        emit RoyaltiesDistributed(assetId, amount);
    }
}
