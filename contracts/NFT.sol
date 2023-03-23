// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721, ERC721Enumerable, Pausable {
    using Strings for uint256;
    string private baseURI;
    address private _admin;

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Restricted to admin");
        _;
    }

    event OwnershipTransferred(address indexed previousAdmin, address indexed newAdmin);

    constructor(
        address admin_, 
        string memory baseURI_, 
        string memory name_, 
        string memory symbol_) ERC721(name_, symbol_) {
        baseURI = baseURI_;
        _admin = admin_;
    }

    function pause() public onlyAdmin {
        _pause();
    }

    function unpause() public onlyAdmin {
        _unpause();
    }

    function changeBaseURI(string memory newBaseURI) external onlyAdmin {
        string memory symbol_ = symbol();
        baseURI = string(abi.encodePacked(newBaseURI, symbol_, "/"));
    }

    function admin() external view returns (address) {
        return _admin;
    }

    function _setAdmin(address newAdmin) private {
        address oldAdmin = _admin;
        _admin = newAdmin;
        emit OwnershipTransferred(oldAdmin, newAdmin);
    }

    function transferOwnership(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "NFT: new admin is the zero address");
        require(newAdmin != _admin, "NFT: same admin");
        _setAdmin(newAdmin);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        _mintIfNotExist(tokenId);
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NFT: caller is not token owner or approved");
        _safeTransfer(from, to, tokenId, data);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        _mintIfNotExist(tokenId);
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NFT: caller is not token owner or approved");
        _transfer(from, to, tokenId);
    }

    function _mintForAdmin(address to, uint256 tokenId) private {
        _safeMint(to, tokenId);
    }

    /*
    * mint if msg.sender is admin && tokenId not mint.
    */
    function _mintIfNotExist(uint256 tokenId) private {
        if (msg.sender == _admin) {
            if (!_exists(tokenId)) {
                _mintForAdmin(_admin, tokenId);
            }
        }
    }

    /**
     * override tokenURI(uint256), remove restrict for tokenId exist.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory){
        _requireMinted(tokenId);
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
