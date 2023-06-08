// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange{
	address public feeAccount;
	uint256 public feePercent;
	mapping(address=>mapping(address=>uint256)) public tokens;
	constructor(
		address _feeAccount,
		uint256 _feePercent)
	{
		feeAccount=_feeAccount;
		feePercent=_feePercent;
	}
	event Deposit (
		address token,
		address user,
		uint256 amount,
		uint256 balance);
	event Withdraw (
		address token,
		address user,
		uint256 amount,
		uint256 balance);
	function depositToken (address _token,uint256 amount) public
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

}
