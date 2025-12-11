// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAssetRegistry {
    struct Asset {
        address owner;
        bytes32 contentHash;
        string uri;
        string metadataURI;
    }

    event AssetRegistered(
        uint256 indexed assetId,
        address indexed owner,
        bytes32 contentHash,
        string uri,
        string metadataURI
    );

    function registerAsset(
        bytes32 contentHash,
        string calldata uri,
        string calldata metadataURI
    ) external returns (uint256);

    function getAsset(uint256 assetId) external view returns (Asset memory);
}
