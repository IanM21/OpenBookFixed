// import { toBufferBE } from 'bigint-buffer';

import { web3 } from '@project-serum/anchor';
import { Market as RayMarket } from '@raydium-io/raydium-sdk';

const NATIVE_MINT = new web3.PublicKey("So11111111111111111111111111111111111111112") 

console.log("NATIVE_MINT",NATIVE_MINT)

const TOKEN_PROGRAM_ID = new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") 

console.log("TOKEN_PROGRAM_ID", TOKEN_PROGRAM_ID)



export type CreatePoolInput = {
  baseMint: web3.PublicKey,
  quoteMint: web3.PublicKey,
  marketId: web3.PublicKey,
  baseMintAmount: number,
  quoteMintAmount: number,
}

// const log = () => console.log({x: any});

async function getMarketInfo(marketId: web3.PublicKey) {
    const connection = new web3.Connection("https://api.devnet.solana.com", { commitment: "confirmed", confirmTransactionInitialTimeout: 60000 })

    // const marketAccountInfo = await this.connection.getAccountInfo(marketId).catch((error) => null)
    const marketAccountInfo = await connection.getAccountInfo(marketId).catch(() => null)
    // const log = () => console.log();

    if (!marketAccountInfo) throw "Market not found"
    try {
      return RayMarket.getLayouts(3).state.decode(marketAccountInfo.data)
    } catch (parseMeketDataError) {
      console.log({ parseMeketDataError })
    }
    return null
  }
  
  export default getMarketInfo;