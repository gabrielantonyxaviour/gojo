// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { OApp, MessagingFee, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract GojoRoyaltyRelayer is OApp, OAppOptionsType3 {

    string public data = "Nothing received yet";
    uint16 public constant SEND = 1;
    uint16 public constant SEND_ABC = 2;
    uint32 public constant STORY_EID = 40315;
    uint32 public constant SKALE_EID = 40273;
    uint32 public constant POLYGON_EID = 40267;

    event MessageRelayed(address sender, uint256 amount, uint32 dstEid);
    error InvalidMsgType();

    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) Ownable(msg.sender) {}

    function quote(
        uint32 _dstEid,
        string memory _message,
        bytes calldata _options,
        bool _payInLzToken
    ) public view returns (MessagingFee memory fee) {
        bytes memory payload = abi.encode(_message);
        fee = _quote(_dstEid, payload, _options, _payInLzToken);
    }

    function combineOptionsHelper(uint32 _dstEid, uint16 _msgType, bytes calldata _extraOptions) external view returns (bytes memory) {
        return combineOptions(_dstEid, _msgType, _extraOptions);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32,
        bytes calldata message,
        address,  
        bytes calldata 
    ) internal override {
        (address sender, uint256 amount, bytes memory relayOptions) = abi.decode(message, (address, uint256, bytes));
    
        uint32 _destinationEid = _origin.srcEid == SKALE_EID ? STORY_EID : SKALE_EID;

        bytes memory _options= this.combineOptionsHelper(_destinationEid, SEND, relayOptions);
        _lzSend(
            _destinationEid,
            abi.encode(sender, amount),
            _options,
            MessagingFee(msg.value, 0),
            payable(address(this))
        );
        emit MessageRelayed(sender, amount, _origin.srcEid);
    }


    receive() external payable {}

}