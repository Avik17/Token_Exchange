const config= require('../src/config.json')
const tokens =(n)=>{
return ethers.utils.parseUnits(n.toString(),'ether');
}
const wait=(seconds)=>{
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve,milliseconds))
}


async function main() {
  const accounts=await ethers.getSigners()

  const {chainId}=await ethers.provider.getNetwork()
  console.log("Using ChainID : ",chainId)

  const avi=await ethers.getContractAt('Token',config[chainId].AVI.address)
    console.log(`AVI fetched from :  ${avi.address}`)

     const mETH=await ethers.getContractAt('Token',config[chainId].mETH.address)
    console.log(`mETH fetched from :  ${mETH.address}`)

     const mDAI=await ethers.getContractAt('Token',config[chainId].mDAI.address)
    console.log(`mDAI fetched from :  ${mDAI.address}`)

    const exchange=await ethers.getContractAt('Exchange',config[chainId].exchange.address)
    console.log(`Exchange fetched from :  ${exchange.address}`)

    const sender=accounts[0]
    const receiver=accounts[1]
    let amount=tokens(10000)

    let transaction,result
    transaction=await mETH.connect(sender).transfer(receiver.address,amount)
    result=await transaction.wait()
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    const user1=accounts[0]
    const user2=accounts[1]
    amount=tokens(10000)


    transaction=await avi.connect(user1).approve(exchange.address,amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user1.address}\n`)

    transaction=await exchange.connect(user1).depositToken(avi.address,amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user1.address}\n`)

    transaction=await mETH.connect(user2).approve(exchange.address,amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user2.address}\n`)

    transaction=await exchange.connect(user2).depositToken(mETH.address,amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user2.address}\n`)
  
    let orderId
    transaction=await exchange.connect(user1).makeOrder(avi.address,tokens(5),mETH.address,tokens(100))
    result=await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    orderId=result.events[0].args.orderCount
    transaction=await exchange.connect(user1).cancelOrder(orderId)
    result=await transaction.wait()
    console.log(`Canceled order from ${user1.address}\n`)
    await wait(1)

    transaction=await exchange.connect(user1).makeOrder(avi.address,tokens(10),mETH.address,tokens(100))
    result=await transaction.wait()
    console.log(`Made order from ${user1.address}`)

 orderId=result.events[0].args.orderCount
    transaction=await exchange.connect(user2).fillOrder(orderId)
    result=await transaction.wait()
    console.log(`Filled order from ${user2.address}\n`)

    await wait(1)
     transaction=await exchange.connect(user1).makeOrder(avi.address,tokens(15),mETH.address,tokens(50))
    result=await transaction.wait()
    console.log(`Made order from ${user1.address}`)

      orderId=result.events[0].args.orderCount
    transaction=await exchange.connect(user2).fillOrder(orderId)
    result=await transaction.wait()
    console.log(`Filled order from ${user2.address}\n`)

    await wait(1)

     transaction=await exchange.connect(user1).makeOrder(avi.address,tokens(20),mETH.address,tokens(200))
    result=await transaction.wait()
    console.log(`Made order from ${user1.address}`)

      orderId=result.events[0].args.orderCount
    transaction=await exchange.connect(user2).fillOrder(orderId)
    result=await transaction.wait()
    console.log(`Filled order from ${user2.address}\n`)

    await wait(1)

    for (let i = 1; i <=10; i++) {
      transaction=await exchange.connect(user1).makeOrder(avi.address,tokens(10),mETH.address,tokens(10*i))
    result=await transaction.wait()
    console.log(`Made order from ${user1.address}`)
    await wait(1)
    }
      for (let i = 1; i <=10; i++) {
      transaction=await exchange.connect(user2).makeOrder(mETH.address,tokens(10*i),avi.address,tokens(10))
    result=await transaction.wait()
    console.log(`Made order from ${user2.address}`)
    await wait(1)
    }


}




// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
