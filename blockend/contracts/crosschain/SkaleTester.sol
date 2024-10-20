// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { OApp, MessagingFee, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SafeERC20, IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { MessagingReceipt, MessagingParams } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

error LzAltTokenUnavailable();

contract SkaleTester is OApp, OAppOptionsType3 {
    using SafeERC20 for IERC20;

    string public data = "Nothing received yet";
    uint16 public constant SEND = 1;
    uint16 public constant SEND_ABC = 2;
    uint32 public constant STORY_EID = 40315;
    uint32 public constant SKALE_EID = 40273;
    uint32 public constant POLYGON_EID = 40267;

    event MessageSent(string message, uint32 dstEid);
    event MessageReceived(string message, uint32 senderEid, bytes32 sender);
    error InvalidMsgType();

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(msg.sender) {}

    function quote(
        uint32 _dstEid,
        uint16 _msgType,
        string memory _message,
        bytes calldata _extraSendOptions,
        bytes calldata _extraRelayOptions,
        bool _payInLzToken
    ) public view returns (MessagingFee memory fee) {
        bytes memory payload = abi.encode(_message, _extraRelayOptions);
        bytes memory options = combineOptions(_dstEid, _msgType, _extraSendOptions);
        fee = _quote(_dstEid, payload, options, _payInLzToken);
    }

    function _payNative(uint256 _nativeFee) internal virtual override returns (uint256 nativeFee) {
        address nativeErc20 = endpoint.nativeToken();
        if (nativeErc20 == address(0)) revert LzAltTokenUnavailable();

        IERC20(nativeErc20).safeTransferFrom(msg.sender, address(endpoint), _nativeFee);
    }

    function _lzSend(uint32 _dstEid, bytes memory _message, bytes memory _options, MessagingFee memory _fee, address _refundAddress) internal virtual override returns (MessagingReceipt memory receipt) {
        _payNative(_fee.nativeFee);
        if (_fee.lzTokenFee > 0) _payLzToken(_fee.lzTokenFee);
        return endpoint.send(
            MessagingParams(_dstEid, _getPeerOrRevert(_dstEid), _message, _options, _fee.lzTokenFee > 0),
            _refundAddress
        );
    }

    function send(
        string memory _message,
        bytes calldata _extraSendOptions, 
        bytes calldata _extraRelayOptions,
        uint256 skaleFee
    ) external payable {
        require(bytes(_message).length <= 32, "String exceeds 32 bytes");

        bytes memory options = combineOptions(POLYGON_EID, SEND_ABC, _extraSendOptions);

        _lzSend(
            POLYGON_EID,
            abi.encode(_message, _extraRelayOptions),
            options,
            // Fee in native gas and ZRO token.
            MessagingFee(skaleFee, 0),
            // Refund address in case of failed source message.
            payable(msg.sender)
        );

        emit MessageSent(_message, POLYGON_EID);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 /*guid*/,
        bytes calldata message,
        address,  // Executor address as specified by the OApp.
        bytes calldata  // Any extra data or options to trigger on receipt.
    ) internal override {
        (string memory _data) = abi.decode(message, (string));
        data = _data;
        emit MessageReceived(data, _origin.srcEid, _origin.sender);
    }

    receive() external payable {}

}