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
	mapping(uint256=>bool)public orderCancelled;
	mapping(uint256=>bool)public orderFilled;
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
	event Cancel
	(
		uint256 orderCount,
		address user,
		address _tokenGive,
		uint256 _amountGive,
		address _tokenGet,
		uint256 _amountGet,
		uint256 timeStamp

	);
	event Fill
	(
		uint256 orderCount,
		address user,
		address _tokenGive,
		uint256 _amountGive,
		address _tokenGet,
		uint256 _amountGet,
		address creator,
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
		Orders[orderCount]=_Order( 
		orderCount,
		msg.sender,
		_tokenGive,
		_amountGive,
		 _tokenGet,
	 	_amountGet,
	 	block.timestamp	);

	 	emit Order( 
	 	orderCount,
		msg.sender,
		_tokenGive,
		_amountGive,
		 _tokenGet,
	 	_amountGet,
	 	block.timestamp	);
	}
	function cancelOrder(uint256 _id)public{
		_Order storage order=Orders[_id];
		require(order.orderCount==_id);
		require(address(order.user)==msg.sender);
		orderCancelled[_id]=true;


		emit Cancel(
		order.orderCount,
		msg.sender,
		order._tokenGive,
		order._amountGive,
		 order._tokenGet,
	 	order._amountGet,
	 	block.timestamp);

	}
	function fillOrder(uint256 _id)
	public
	{
		require(_id>0 && _id<=orderCount);
		
		require(!orderFilled[_id]);
		require(!orderCancelled[_id]);
		_Order storage order=Orders[_id];
		_trade(
			order.orderCount,
			order.user,
			order._tokenGive,
			order._amountGive,
			order._tokenGet,
			order._amountGet
			);
		orderFilled[_id]=true;
		emit Fill(
		order.orderCount,
		msg.sender,
		order._tokenGive,
		order._amountGive,
		order._tokenGet,
	 	order._amountGet,
	 	order.user,
	 	block.timestamp);
	}
	function _trade(
		uint256 _id,
		address user,
		address _tokenGive,
		uint256 _amountGive,
		address _tokenGet,
		uint256 _amountGet)
	internal
{
	uint256 feeAmount=(_amountGet*feePercent)/100;
	tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] -(_amountGet+feeAmount);
	tokens[_tokenGet][user] = tokens[_tokenGet][user] + _amountGet;

	tokens[_tokenGet][feeAccount]=	tokens[_tokenGet][feeAccount]+feeAmount;

	tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] + _amountGive;
	tokens[_tokenGive][user] = tokens[_tokenGive][user] - _amountGive;
}
}