// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { OApp, MessagingFee, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract PolygonRelayer is OApp, OAppOptionsType3 {

    string public data = "Nothing received yet";
    uint16 public constant SEND = 1;
    uint16 public constant SEND_ABC = 2;
    uint32 public constant STORY_EID = 40315;
    uint32 public constant SKALE_EID = 40273;
    uint32 public constant POLYGON_EID = 40267;

    event MessageRelayed(string message, uint32 dstEid);
    event MessageReceived(string message, uint32 senderEid, bytes32 sender);
    error InvalidMsgType();

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(msg.sender) {}

    function encodeMessage(string memory _message, uint16 _msgType, bytes memory _extraReturnOptions) public pure returns (bytes memory) {
        uint256 extraOptionsLength = _extraReturnOptions.length;
        return abi.encode(_message, _msgType, extraOptionsLength, _extraReturnOptions, extraOptionsLength);
    }

    function quote(
        uint32 _dstEid,
        uint16 _msgType,
        string memory _message,
        bytes calldata _extraSendOptions,
        bytes calldata _extraReturnOptions,
        bool _payInLzToken
    ) public view returns (MessagingFee memory fee) {
        bytes memory payload = encodeMessage(_message, _msgType, _extraReturnOptions);
        bytes memory options = combineOptions(_dstEid, _msgType, _extraSendOptions);
        fee = _quote(_dstEid, payload, options, _payInLzToken);
    }

    function decodeMessage(bytes calldata encodedMessage) public pure returns (string memory message, uint16 msgType, uint256 extraOptionsStart, uint256 extraOptionsLength) {
        extraOptionsStart = 256;  // Starting offset after _message, _msgType, and extraOptionsLength
        string memory _message;
        uint16 _msgType;

        // Decode the first part of the message
        (_message, _msgType, extraOptionsLength) = abi.decode(encodedMessage, (string, uint16, uint256));

        return (_message, _msgType, extraOptionsStart, extraOptionsLength);
    }


    function _lzReceive(
        Origin calldata _origin,
        bytes32 /*guid*/,
        bytes calldata message,
        address,  // Executor address as specified by the OApp.
        bytes calldata  // Any extra data or options to trigger on receipt.
    ) internal override {

        (string memory _data, uint16 _msgType, uint256 extraOptionsStart, uint256 extraOptionsLength) = decodeMessage(message);
        data = _data;

        if(_msgType == SEND) revert InvalidMsgType();

        if (_msgType == SEND_ABC) {

            string memory _newMessage = "Source chain said HI!";

            uint32 _destinationEid = _origin.srcEid == SKALE_EID ? STORY_EID : SKALE_EID;

            bytes memory _options = combineOptions(_destinationEid, SEND, message[extraOptionsStart:extraOptionsStart + extraOptionsLength]);

            _lzSend(
                _destinationEid,
                abi.encode(_newMessage, SEND),
                // Future additions should make the data types static so that it is easier to find the array locations.
                _options,
                // Fee in native gas and ZRO token.
                MessagingFee(msg.value, 0),
                // Refund address in case of failed send call.
                // @dev Since the Executor makes the return call, this contract is the refund address.
                payable(address(this))
            );

            emit MessageRelayed(_newMessage, _origin.srcEid);
        }
    }


    receive() external payable {}

}