const {ethers} = require('hardhat')
const {expect} = require('chai')
const tokens =(n)=>{
return ethers.utils.parseUnits(n.toString(),'ether');
}

describe('Exchange',()=>{
	let exchange,
		accounts,
		deployer,
		feeAccount
		const feePercent=10
	beforeEach(async()=>
	{
		accounts=await ethers.getSigners()
		 deployer =accounts[0]
		 feeAccount=accounts[1]
		 user1=accounts[2]
		 const Exchange = await ethers.getContractFactory('Exchange');
		 const Token=await ethers.getContractFactory('Token')
		 token1 = await Token.deploy('AVINASH',
		 							'AVI',
		 							'1000000');
		 token2 = await Token.deploy('DAI',
		 							'mDAI',
		 							'1000000');
		let transaction= await token1.connect(deployer).transfer(user1.address,tokens(100))
		 await transaction.wait()


		 exchange = await Exchange.deploy(feeAccount.address,feePercent);
	})	 
		describe('Deployment',()=>{
			it('tracks the fee account',async()=>{
				expect(await exchange.feeAccount()).to.equal(feeAccount.address)
			})
			it('tracks the fee percent',async()=>{
				expect(await exchange.feePercent()).to.equal(feePercent)
			})
		})
		 
		describe('Depositing token',()=>{
			let amount=tokens(10)
			let	transaction,
				result

				describe('Success',()=>
				{
					
				beforeEach(async()=>{

					transaction=await token1.connect(user1).approve(exchange.address,amount)
					result= await transaction.wait()

					transaction=await exchange.connect(user1).depositToken(token1.address,amount)
					result=await transaction.wait()
				})
					it('tracks the token deposit',async()=>{
						expect(await token1.balanceOf(exchange.address)).to.equal(amount)
						expect(await exchange.tokens(token1.address,user1.address)).to.equal(amount)	
						expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(amount)	

					})

					it('Emits a Deposit event',async()=>
					{
			//console.log(result)
						const event=result.events[1];
						expect(event.event).to.equal('Deposit');
						const args=event.args;
			//console.log(event.args);
						expect(args.token).to.equal(token1.address);
						expect(args.user).to.equal(user1.address);
						expect(args.amount).to.equal(amount);
						expect(args.balance).to.equal(amount);
					})
				})
				describe('Failure',()=>{
					it('fails when tokens are not approved',async()=>{
						await expect(exchange.connect(user1).depositToken(token1.address,amount)).to.be.reverted
					})
				})
		})

		describe('Withdrawing token',()=>{
			let amount=tokens(10)
			let	transaction,
				result

				describe('Success',()=>
				{
					
				beforeEach(async()=>{

					transaction=await token1.connect(user1).approve(exchange.address,amount)
					result= await transaction.wait()

					transaction=await exchange.connect(user1).depositToken(token1.address,amount)
					result=await transaction.wait()

					transaction=await exchange.connect(user1).withdrawToken(token1.address,amount)
					result=await transaction.wait()

				})
					it('tracks the token withdrawing',async()=>{
						expect(await token1.balanceOf(exchange.address)).to.equal(0)
						expect(await exchange.tokens(token1.address,user1.address)).to.equal(0)	
						expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(0)	

					})

					it('Emits a Withdraw event',async()=>
					{
			//console.log(result)
						const event=result.events[1];
						expect(event.event).to.equal('Withdraw');
						const args=event.args;
			//console.log(event.args);
						expect(args.token).to.equal(token1.address);
						expect(args.user).to.equal(user1.address);
						expect(args.amount).to.equal(amount);
						expect(args.balance).to.equal(0);
					})
				})
				describe('Failure',()=>{
					it('fails when tokens are insufficient',async()=>{
						await expect(exchange.connect(user1).withdrawToken(token1.address,amount)).to.be.reverted
					})
				})

			
		})
		describe('Checking Balances',async()=>{
			let amount=tokens(10)
			let	transaction,
				result
				
					it('tracks the balance',async()=>{
					transaction=await token1.connect(user1).approve(exchange.address,amount)
					result= await transaction.wait()

					transaction=await exchange.connect(user1).depositToken(token1.address,amount)
					result=await transaction.wait()

					expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(amount)	

					})
				})
		describe('Make Orders',()=>{
			let amount=tokens(10)
			let	transaction,
				result

				describe('Success',()=>
				{
					
				beforeEach(async()=>{

					transaction=await token1.connect(user1).approve(exchange.address,amount)
					result= await transaction.wait()

					transaction=await exchange.connect(user1).depositToken(token1.address,amount)
					result=await transaction.wait()

					transaction=await exchange.connect(user1).makeOrder(token1.address,amount,token2.address,amount)
					result=await transaction.wait()

				})
					it('tracks the Order',async()=>{
					

						expect(await exchange.orderCount()).to.equal(1)	
						//expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(0)	

					})

					it('Emits a Order event',async()=>
					{
			//console.log(result)
						const event=result.events[0];
						expect(event.event).to.equal('Order');
						const args=event.args;
			//console.log(event.args);
						expect(args.orderCount).to.equal(1);
						expect(args.user).to.equal(user1.address);
						expect(args._tokenGive).to.equal(token1.address);
						expect(args._amountGive).to.equal(amount);
						expect(args._tokenGet).to.equal(token2.address);
						expect(args._amountGet).to.equal(amount);
						
					})
				})
				describe('Failure',()=>{
					it('fails when tokens are insufficient',async()=>{
						await expect(exchange.connect(user1).makeOrder(token1.address,amount,token2.address,amount)).to.be.reverted
					})
				})

			
		})


})