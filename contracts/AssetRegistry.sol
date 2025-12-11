// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IAssetRegistry.sol";

contract AssetRegistry is IAssetRegistry {
    uint256 private _assetCounter;

    mapping(uint256 => Asset) private _assets;

    function registerAsset(
        bytes32 contentHash,
        string calldata uri,
        string calldata metadataURI
    ) external override returns (uint256) {
        _assetCounter += 1;
        uint256 newId = _assetCounter;

        _assets[newId] = Asset({
            owner: msg.sender,
            contentHash: contentHash,
            uri: uri,
            metadataURI: metadataURI
        });

        emit AssetRegistered(newId, msg.sender, contentHash, uri, metadataURI);
        return newId;
    }

    function getAsset(uint256 assetId) external view override returns (Asset memory) {
        return _assets[assetId];
    }
}
