

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { OApp, Origin, MessagingFee, MessagingReceipt} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error InvalidCrosschainCaller(uint32 eid, bytes32 caller);
error NotEnoughAllowance(uint256 allowance, uint256 amount);
error UnAuthorizedCaller(address caller);

contract GojoStoryUsdWrapper is OApp, OAppOptionsType3 {

    bytes32 public gojoWrappedUsdAddress;
    bytes32 public gojoRelayer;
    address public constant STORY_USD = 0x91f6F05B08c16769d3c85867548615d270C42fC7;
    uint16 public constant SEND = 1;
    uint16 public constant SEND_ABC = 2;
    uint32 public constant STORY_EID = 40315;
    uint32 public constant SKALE_EID = 40273;
    uint32 public constant POLYGON_EID = 40267;

    constructor(address _endpoint) OApp(_endpoint, msg.sender) Ownable(msg.sender) {

    }
    
    event MessageSent(bytes32 guid, uint256 amount);
    event MessageReceived(bytes32 guid, Origin origin, address executor, bytes payload, bytes extraData);
    
    modifier onlyGojoRelayer(uint32 _eid, bytes32 _sender){
        if(_eid != POLYGON_EID || _sender != gojoRelayer) revert InvalidCrosschainCaller(_eid, _sender);
        _;
    }

    function setGojoWrappedUsdAddress(address _gojoWrappedUsdAddress) external onlyOwner {
        gojoWrappedUsdAddress = addressToBytes32(_gojoWrappedUsdAddress);
        setPeer(SKALE_EID, addressToBytes32(_gojoWrappedUsdAddress));
    }

    function setGojoRelayer(address _gojoRelayer) external onlyOwner {
        gojoRelayer = addressToBytes32(_gojoRelayer);
        setPeer(STORY_EID, gojoRelayer);
    }

    function bridgeToSKALE(uint256 _amount, bytes calldata _extraSendOptions, bytes calldata _extraRelayOptions) external payable {
        uint256 allowance = IERC20(STORY_USD).allowance(msg.sender, address(this));
        if(allowance < _amount) revert NotEnoughAllowance(allowance, _amount);
        IERC20(STORY_USD).transferFrom(msg.sender, address(this), _amount);
        _send(_amount, _extraSendOptions, _extraRelayOptions);
    }

    function _send(
        uint256 amount,
        bytes calldata _extraSendOptions, 
        bytes calldata _extraRelayOptions
    ) internal {
        bytes memory options = combineOptions(POLYGON_EID, SEND_ABC, _extraSendOptions);

        MessagingReceipt memory receipt=_lzSend(
            POLYGON_EID,
            abi.encode(msg.sender, amount, _extraRelayOptions),
            options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );

        emit MessageSent(receipt.guid, amount);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _payload,
        address _executor,  
        bytes calldata _extraData  
    ) internal override  onlyGojoRelayer(_origin.srcEid, _origin.sender){
        (address receiver, uint256 amount) = abi.decode(_payload, (address, uint256));

        IERC20(STORY_USD).transferFrom(address(this), receiver, amount);
        emit MessageReceived(_guid, _origin, _executor, _payload, _extraData);
    }

    function quote(
        uint256 tokenAmount,
        bytes calldata _extraSendOptions,
        bytes calldata _extraRelayOptions,
        bool _payInLzToken
    ) public view returns (MessagingFee memory fee) {
        bytes memory payload = abi.encode(msg.sender, tokenAmount, _extraRelayOptions);
        bytes memory options = combineOptions(POLYGON_EID, SEND_ABC, _extraSendOptions);
        fee = _quote(POLYGON_EID, payload, options, _payInLzToken);
    }

    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }
    
}
