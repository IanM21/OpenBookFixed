// export const CreatePool = () => {
//     return(
//         <div>Hello World</div>
//     )
// }

import { FC } from 'react';

// import { Metadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
// import { AccountLayout, MintLayout, NATIVE_MINT, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createCloseAccountInstruction, getAssociatedTokenAddressSync } from '@solana/spl-token'
// import { BaseSpl } from "./base/baseSpl";
// import { searcherClient } from "jito-ts/dist/sdk/block-engine/searcher";
// import { bundle } from "jito-ts";
// import { Liquidity, LiquidityPoolInfo, Percent, Token, TokenAmount } from "@raydium-io/raydium-sdk";
import BN from 'bn.js';

// import fs from 'fs';
// import save from 'save-file';
import { web3 } from '@project-serum/anchor';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useConnection } from '@solana/wallet-adapter-react';

import CreatePools from './base/CreatePools';
// import { BaseRay } from './base/baseRay';
// import { BaseRay } from './base/baseRay';
import getMarketInfo from './base/getMarketInfo';

// import { BaseMpl } from "./base/baseMpl";
// import { Result } from './base/types';
type Result<T, E = any> = {
    Ok?: T,
    Err?: E
}

// import { ENV } from './constants';

const ENV = {
    PINATA_API_kEY : "43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT",
    PINATA_DOMAIN : "https://",
    PINATA_API_SECRET_KEY : "43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT",
    IN_PRODUCTION : false,
    COMPUTE_UNIT_PRICE : 1_800_000, // default: 200_000 
    JITO_AUTH_KEYPAIR : getKeypairFromStr("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")!,
    JITO_BLOCK_ENGINE_URL : "https://"
}

// import { CreatePoolInput } from './types';
// import {
//   getKeypairFromStr,
//   getPubkeyFromStr,
//   sleep,
// } from './utils';

export type CreatePoolInput = {
    marketId: web3.PublicKey,
    baseMintAmount: number,
    quoteMintAmount: number,
    url: 'mainnet' | 'devnet',
}

//   const { connection } = useConnection();
//   const { publicKey, sendTransaction } = useWallet();

// import { bull_dozer } from "./jito_bundle/send-bundle";
const log = console.log;

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  export function getPubkeyFromStr(str?: string) {
    try {
      return new web3.PublicKey((str ?? "").trim())
    } catch (error) {
      return null
    }
  }

  export function getKeypairFromStr(str: string): web3.Keypair | null {
    try {
      return web3.Keypair.fromSecretKey(Uint8Array.from(bs58.decode(str)))
    } catch (error) {
      return null
    }
  }

export const CreatePool: FC = () => {

    const { connection } = useConnection();
    // const { publicKey, sendTransaction } = useWallet();

    async function createPool(input: CreatePoolInput): Promise<Result<{ poolId: string, txSignature: string, baseAmount: BN, quoteAmount: BN, baseDecimals: number, quoteDecimals: number }, string>> {
        // let { baseMintAmount, quoteMintAmount, marketId } = input
        const { baseMintAmount, quoteMintAmount, marketId } = input

        ////////ayad/////////
        // const keypair = getKeypairFromEnv();
        const keypair = getKeypairFromStr("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT");
        if(!keypair){
            return { Err: "keypair not found" }
        }
        // const connection = new web3.Connection(input.url == 'mainnet' ? RPC_ENDPOINT_MAIN : RPC_ENDPOINT_DEV, { commitment: "confirmed", confirmTransactionInitialTimeout: 60000 })
        // const baseRay = new BaseRay({ rpcEndpointUrl: connection.rpcEndpoint })

        // const baseRay = new BaseRay()
        // const marketState = await baseRay.getMarketInfo(marketId).catch((getMarketInfoError) => { log({ getMarketInfoError }); return null })
        const marketState = await getMarketInfo(marketId).catch((getMarketInfoError) => { log({ getMarketInfoError }); return null })
        // log({marketState})
        if (!marketState) {
            return { Err: "market not found" }
        }
        const { baseMint, quoteMint } = marketState
        log({
            baseToken: baseMint.toBase58(),
            quoteToken: quoteMint.toBase58(),
        })

        
        // const txInfo = await baseRay.createPool({ baseMint, quoteMint, marketId, baseMintAmount, quoteMintAmount }, keypair.publicKey).catch((innerCreatePoolError) => { log({ innerCreatePoolError }); return null })
        const txInfo = await CreatePools({ baseMint, quoteMint, marketId, baseMintAmount, quoteMintAmount }, keypair.publicKey).catch((innerCreatePoolError) => { log({ innerCreatePoolError }); return null })
        if (!txInfo) return { Err: "Failed to prepare create pool transaction" }
        // speedup
        const updateCuIx = web3.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: ENV.COMPUTE_UNIT_PRICE })
        const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        const txMsg = new web3.TransactionMessage({
            instructions: [updateCuIx, ...txInfo.ixs],
            payerKey: keypair.publicKey,
            recentBlockhash,
        }).compileToV0Message()
        const tx = new web3.VersionedTransaction(txMsg)
        tx.sign([keypair, ...txInfo.signers])
        const rawTx = tx.serialize()
        console.log("PoolId: ", txInfo.poolId.toBase58())
        console.log("SENDING CREATE POOL TX")
        // const simRes = (await connection.simulateTransaction(tx)).value
        //////ayad//////////////
        // fs.writeFileSync('./poolCreateTxSim.json', JSON.stringify(simRes))
        // await save(JSON.stringify(simRes), './poolCreateTxSim.json')

        const txSignature = (await web3.sendAndConfirmRawTransaction(connection, Buffer.from(rawTx), { commitment: 'confirmed' })
            .catch(async () => {
                await sleep(500)
                return await web3.sendAndConfirmRawTransaction(connection, Buffer.from(rawTx), { commitment: 'confirmed' })
                    .catch((createPoolAndBuyTxFail) => {
                        log({ createPoolAndBuyTxFail })
                        return null
                    })
            }))
        console.log("CONFIRMED CREATE POOL TX")
        if (!txSignature) log("Tx failed")
        // const txSignature = await connection.sendTransaction(tx).catch((error) => { log({ createPoolTxError: error }); return null });
        if (!txSignature) {
            return { Err: "Failed to send transaction" }
        }
        return {
            Ok: {
                poolId: txInfo.poolId.toBase58(),
                txSignature,
                baseAmount: txInfo.baseAmount,
                quoteAmount: txInfo.quoteAmount,
                baseDecimals: txInfo.baseDecimals,
                quoteDecimals: txInfo.quoteDecimals,
            }
        }
    }

    async function Pool() {
        log(process.env.NEXT_PUBLIC_KEYPAIR)
        /*
        SALD : Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb
        WSOL : So11111111111111111111111111111111111111112
        OpenMarket ID : BzcDHvKWD4LyW4X1NUEaWLBaNmyiCUKqcd3jXDRhwwAG
        AMM ID: 2viGyp1hY8PGw7GEPzJvLdPAQpe7zL745oHp1C6a3jcJ
        https://openbookfixed.onrender.com/market/BzcDHvKWD4LyW4X1NUEaWLBaNmyiCUKqcd3jXDRhwwAG?network=devnet&address=HLwPARhaNdaehQpkijmir6ZStHGmhHqqkrQjcdbYNyEN
        */
        // const marketIdS = "BzcDHvKWD4LyW4X1NUEaWLBaNmyiCUKqcd3jXDRhwwAG"
        // const marketIdS = "F6Abrndt3sWNreVesrb6nzqNiPfCpeY6qesTzPPbyqyd"
        // const marketIdS = "21TJSyureafPDtKd82dqwfns8XNJ9dfhhAWQYKtrnSf4"
        // const marketIdS = "9xDZVHxgkjDCatnTQaGrCah9tB33AvzfeCBSxtUuem7L"
        // const marketIdS = "Awzg68zDH3wSmtBan9Lkn4ADwgxbHsKhuzumsu33cEsc"
        // const marketIdS = "2AP8Bc3PmA35rBfsyjGgSpk4oEzAkb2JFTMgwZjxungx"
        const marketIdS = "Chy7Ueoz1KsGTtxHT6wFUpM4W3qq2Z8QdfRnHR5DUfJc"
        
        const id = getPubkeyFromStr(marketIdS)
        if (!id) {
            log("Invalid market id")
            return
        }
        const marketId = id
        const baseAmount = 2
        const quoteAmount = 2
        const url = 'devnet'

        // if(marketId) {
        const res = await createPool({
            marketId,
            baseMintAmount: baseAmount,
            quoteMintAmount: quoteAmount,
            url
        }).catch(error => {
            console.log({
                createPoolError: error
            });
            return null
        });
        if (!res) return log("failed to create pool")
        if (res.Err) return log({
            error: res.Err
        })
        if (!res.Ok) return log("failed to create pool")
        const {
            poolId,
            txSignature
        } = res.Ok
        log("Pool creation transaction successfully:")
        log("transaction signature: ", txSignature)
        log("pool address: ", poolId)
        // } else {return null}
    }
    
    return(
        <>
            <div>Create Pool</div>
            <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={() => Pool()}>
          <span>Create Pool</span>
      </button>
        </>
    )
}
