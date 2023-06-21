
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


function App() {
  const dispatch=useDispatch()
  const loadBlockchainData=async()=>{
    
  
  const provider= loadProvider(dispatch)
  const chainId=await loadNetwork(provider,dispatch)

  const AVI=config[chainId].AVI
  const mETH=config[chainId].mETH
  const exchangeConfig=config[chainId].exchange
  await loadAccount(provider,dispatch)

  await loadTokens(provider,[AVI.address,mETH.address],dispatch)
  await loadExchange(provider,exchangeConfig.address,dispatch)
  
  
 
  
  }
  useEffect(()=>{
    loadBlockchainData()
  })
  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

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