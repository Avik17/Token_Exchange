
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';
import { 
  loadProvider,
  loadNetwork, 
  loadAccount,
  loadTokens,
  loadExchange
 } 
  from '../store/interactions';

  import Navbar from './Navbar';
  import Markets from './Markets';


function App() {
  const dispatch=useDispatch()
  const loadBlockchainData=async()=>{
    
  
  const provider= loadProvider(dispatch)
  const chainId=await loadNetwork(provider,dispatch)

  const AVI=config[chainId].AVI
  const mETH=config[chainId].mETH
  const exchangeConfig=config[chainId].exchange
  window.ethereum.on('chainChanged',()=>{
    window.location.reload()
   })
 window.ethereum.on('accountsChanged',()=>{
  loadAccount(provider,dispatch)
 })
 

  await loadTokens(provider,[AVI.address,mETH.address],dispatch)
  await loadExchange(provider,exchangeConfig.address,dispatch)
  
  
 
  
  }
  useEffect(()=>{
    loadBlockchainData()
  })
  return (
    <div>

      {/* Navbar */}
      <Navbar/>

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}
          <Markets/>

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;