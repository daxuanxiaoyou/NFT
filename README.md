# NFT
npm install

## 合约说明
这个合约主要用于bybit铸造NFT，管理员通过safeTransferFrom方法来铸造NFT并转移给NFT所有者：

    1. 由admin指定id铸造
    2. 如果是admin地址发起，则会mint nft if token not exist
    3. 如果是其他地址（非admin）发起，则按照正常的流程进行转账（检查是否owner或被授权）

```text
function：
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
```
