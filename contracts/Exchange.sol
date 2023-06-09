// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange{
	address public feeAccount;
	uint256 public feePercent;
	struct _Order 
	{
		uint256 orderCount;
		address user;
		address _tokenGive;
		uint256 _amountGive;
		address _tokenGet;
		uint256 _amountGet;
		uint256 timeStamp;

	}
	mapping(address=>mapping(address=>uint256)) public tokens;
	mapping(uint256=>_Order) Orders;
	uint256 public orderCount;

	constructor(
		address _feeAccount,
		uint256 _feePercent)
	{
		feeAccount=_feeAccount;
		feePercent=_feePercent;
	}
	
	event Deposit 
	(
		address token,
		address user,
		uint256 amount,
		uint256 balance
	);
	event Withdraw (
		address token,
		address user,
		uint256 amount,
		uint256 balance);
	event Order 
	(
		uint256 orderCount,
		address user,
		address _tokenGive,
		uint256 _amountGive,
		address _tokenGet,
		uint256 _amountGet,
		uint256 timeStamp

	);
	function depositToken 
	(address _token,
		uint256 amount) public
	{
		require(Token(_token).transferFrom(msg.sender,address(this),amount));
		tokens[_token][msg.sender]=	tokens[_token][msg.sender]+ amount;
		emit Deposit(_token,msg.sender,amount,tokens[_token][msg.sender]);

	}
	function withdrawToken (address _token,uint256 amount) public
	{
		Token(_token).transfer(msg.sender,amount);

		tokens[_token][msg.sender]=	tokens[_token][msg.sender]- amount;
		emit Withdraw(_token,msg.sender,amount,tokens[_token][msg.sender]);

	}
	function balanceOf(
		address _token,
		address user)
		public view 
		returns(uint256)
	{
		return tokens[_token][user];
	}
	function makeOrder(

	
		address _tokenGive,
		uint256 _amountGive,
		address _tokenGet,
		uint256 _amountGet
		) 
		public
	{	require(balanceOf(_tokenGive,msg.sender)>=_amountGive);
		orderCount=orderCount+1;
		Orders[orderCount]=_Order( orderCount,
		msg.sender,
		_tokenGive,
		_amountGive,
		 _tokenGet,
	 	_amountGet,
	 	block.timestamp	);
	 	emit Order( orderCount,
		msg.sender,
		_tokenGive,
		_amountGive,
		 _tokenGet,
	 	_amountGet,
	 	block.timestamp	);
	}


}
