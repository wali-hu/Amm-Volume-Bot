"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const bn_js_1 = __importDefault(require("bn.js"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const web3_js_1 = require("@solana/web3.js");
const parseArgs = () => {
    const args = process.argv.slice(2);
    const params = {};
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        params[key] = value;
    }
    return {
        buyAmount: new bn_js_1.default(params.buyAmount || '100000000'), // 0.1 SOL default
        sellAmount: new bn_js_1.default(params.sellAmount || '10000000'), // 10 tokens default
        poolId: params.poolId || 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C',
        slippage: parseFloat(params.slippage || '0.005'), // 0.5% default
    };
};
const atomicBuySell = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { buyAmount, sellAmount, poolId, slippage } = params;
    const raydium = yield (0, config_1.initSdk)({ loadToken: true });
    console.log(`

           ATOMIC BUY-SELL SWAP (Single Transaction)         

  `);
    console.log(` Configuration:
   Buy Amount: ${new decimal_js_1.default(buyAmount.toString()).div(Math.pow(10, 9)).toString()} SOL (${buyAmount.toString()} lamports)
   Sell Amount: ${new decimal_js_1.default(sellAmount.toString()).div(Math.pow(10, 6)).toString()} tokens (${sellAmount.toString()} units)
   Slippage: ${(slippage * 100).toFixed(2)}%
   Pool ID: ${poolId}
  `);
    try {
        // ============ STEP 1: Fetch Pool Data ============
        console.log(' Fetching pool information...');
        const poolData = yield raydium.api.fetchPoolById({ ids: poolId });
        if (!poolData || poolData.length === 0) {
            console.error(' Pool not found');
            return;
        }
        const pool = poolData[0];
        console.log(' Pool found!');
        console.log(`   Base Token (mintA): ${pool.mintA.symbol} (${pool.mintA.address})`);
        console.log(`   Quote Token (mintB): ${pool.mintB.symbol || 'Custom'} (${pool.mintB.address})`);
        // Get pool info from RPC
        const rpcData = yield raydium.liquidity.getPoolInfoFromRpc({ poolId });
        const poolInfo = rpcData.poolInfo;
        const poolKeys = rpcData.poolKeys;
        // ============ STEP 2: Create BUY Swap Instruction ============
        console.log('\n Creating BUY swap instruction (SOL  Token)...');
        const inputMintBuy = pool.mintA.address; // SOL
        const outputMintBuy = pool.mintB.address; // Custom Token
        const { amountOut: buyAmountOut, minAmountOut: buyMinAmountOut, priceImpact: buyPriceImpact } = raydium.liquidity.computeAmountOut({
            poolInfo,
            amountIn: buyAmount,
            mintIn: inputMintBuy,
            mintOut: outputMintBuy,
            slippage,
        });
        const expectedTokensFromBuy = new decimal_js_1.default(buyAmountOut.toString()).div(Math.pow(10, 6));
        const minTokensFromBuy = new decimal_js_1.default(buyMinAmountOut.toString()).div(Math.pow(10, 6));
        console.log(` Buy Swap Computed:
   Expected Output: ${expectedTokensFromBuy.toString()} tokens
   Min Output (${(slippage * 100).toFixed(2)}% slippage): ${minTokensFromBuy.toString()} tokens
   Price Impact: ${buyPriceImpact.toFixed(4)}%
    `);
        // Get buy swap
        const buySwapResult = yield raydium.liquidity.swap({
            poolInfo,
            poolKeys,
            inputMint: inputMintBuy,
            amountIn: buyAmount,
            amountOut: buyMinAmountOut,
            fixedSide: 'in',
            txVersion: config_1.txVersion,
            config: {
                inputUseSolBalance: true,
                outputUseSolBalance: false,
            },
            computeBudgetConfig: {
                units: 1200000, // Higher budget for dual swaps
                microLamports: 100000000,
            },
        });
        // ============ STEP 3: Create SELL Swap Instruction ============
        console.log(' Creating SELL swap instruction (Token  SOL)...');
        const inputMintSell = pool.mintB.address; // Custom Token
        const outputMintSell = pool.mintA.address; // SOL
        const { amountOut: sellAmountOut, minAmountOut: sellMinAmountOut, priceImpact: sellPriceImpact } = raydium.liquidity.computeAmountOut({
            poolInfo,
            amountIn: sellAmount,
            mintIn: inputMintSell,
            mintOut: outputMintSell,
            slippage,
        });
        const expectedSolFromSell = new decimal_js_1.default(sellAmountOut.toString()).div(Math.pow(10, 9));
        const minSolFromSell = new decimal_js_1.default(sellMinAmountOut.toString()).div(Math.pow(10, 9));
        console.log(` Sell Swap Computed:
   Expected Output: ${expectedSolFromSell.toString()} SOL
   Min Output (${(slippage * 100).toFixed(2)}% slippage): ${minSolFromSell.toString()} SOL
   Price Impact: ${sellPriceImpact.toFixed(4)}%
    `);
        // Get sell swap
        const sellSwapResult = yield raydium.liquidity.swap({
            poolInfo,
            poolKeys,
            inputMint: inputMintSell,
            amountIn: sellAmount,
            amountOut: sellMinAmountOut,
            fixedSide: 'in',
            txVersion: config_1.txVersion,
            config: {
                inputUseSolBalance: false,
                outputUseSolBalance: true,
            },
            computeBudgetConfig: {
                units: 1200000,
                microLamports: 100000000,
            },
        });
        // ============ STEP 4: Get Raw Instructions ============
        console.log('\n Extracting swap instructions...');
        // Get buy instruction data (without executing/sending)
        const buyInstructionData = (yield buySwapResult.execute({ sendAndConfirm: false }));
        const sellInstructionData = (yield sellSwapResult.execute({ sendAndConfirm: false }));
        const buyTx = buyInstructionData.signedTx;
        const sellTx = sellInstructionData.signedTx;
        // Extract the raw instructions from the transaction messages
        // For VersionedTransaction with MessageV0, we need to decode the message
        const buyMessage = buyTx.message;
        const sellMessage = sellTx.message;
        // MessageV0 stores instructions in the message itself, we need to reconstruct them
        // The signed transactions are already compiled, so we extract and recombine
        console.log(' Transactions extracted');
        // ============ STEP 5: Build Combined Transaction ============
        console.log('\n  Building atomic combined transaction...');
        // Get latest blockhash
        const { blockhash, lastValidBlockHeight } = yield config_1.connection.getLatestBlockhash('finalized');
        // Since we have signed transactions, we'll use a different approach:
        // Decode the serialized transaction data and rebuild with combined instructions
        // For V0 transactions, we need to reconstruct by getting the account keys and instructions
        // Alternative: Use the internal transaction structure
        const buyInstructions = buyTx.message._instructions || [];
        const sellInstructions = sellTx.message._instructions || [];
        if (buyInstructions.length === 0 || sellInstructions.length === 0) {
            // Fallback: The instructions might be in a different location
            console.log('  Note: Using sequential execution due to SDK structure');
            console.log(' Sending buy and sell as dependent operations in sequence...\n');
            // Execute buy first
            console.log(' Executing BUY transaction...');
            const { txId: buyTxId } = yield buySwapResult.execute({ sendAndConfirm: true });
            console.log(` Buy completed: ${buyTxId}`);
            // Wait a moment for state to settle
            yield new Promise(resolve => setTimeout(resolve, 2000));
            // Execute sell second
            console.log(' Executing SELL transaction...');
            const { txId: sellTxId } = yield sellSwapResult.execute({ sendAndConfirm: true });
            console.log(` Sell completed: ${sellTxId}`);
            console.log(`

                BUY-SELL SWAP SUCCESSFUL!                     

                                                                
   BUY SWAP (SOL  Token):                                   
    Transaction: ${buyTxId}
    Input:  ${new decimal_js_1.default(buyAmount.toString()).div(Math.pow(10, 9)).toString()} SOL
    Output: ~${minTokensFromBuy.toString()} tokens              
                                                                
   SELL SWAP (Token  SOL):                                  
    Transaction: ${sellTxId}
    Input:  ${new decimal_js_1.default(sellAmount.toString()).div(Math.pow(10, 6)).toString()} tokens
    Output: ~${minSolFromSell.toString()} SOL                   
                                                                
   Sequential execution ensures proper state updates         
                                                                

      `);
            return { buy: buyTxId, sell: sellTxId };
        }
        // If we got instructions, combine them
        const combinedInstructions = [...buyInstructions, ...sellInstructions];
        console.log(` Combined total instructions: ${combinedInstructions.length}`);
        const combinedMessage = new web3_js_1.TransactionMessage({
            payerKey: config_1.owner.publicKey,
            recentBlockhash: blockhash,
            instructions: combinedInstructions,
        }).compileToV0Message();
        const combinedTransaction = new web3_js_1.VersionedTransaction(combinedMessage);
        combinedTransaction.sign([config_1.owner]);
        console.log(' Transaction built and signed!');
        console.log(' Transaction size:', combinedTransaction.serialize().length, 'bytes');
        // ============ STEP 6: Send and Confirm ============
        console.log('\n Sending atomic transaction...');
        const txId = yield config_1.connection.sendTransaction(combinedTransaction, {
            skipPreflight: false,
            maxRetries: 3,
        });
        console.log(` Transaction sent: ${txId}`);
        console.log(' Waiting for confirmation...');
        const confirmation = yield config_1.connection.confirmTransaction({ signature: txId, blockhash, lastValidBlockHeight }, 'finalized');
        if (confirmation.value.err) {
            console.error(' Transaction failed!');
            throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }
        console.log(`

                ATOMIC SWAP SUCCESSFUL!                       

                                                                
   BUY SWAP (SOL  Token):                                   
    Input:  ${new decimal_js_1.default(buyAmount.toString()).div(Math.pow(10, 9)).toString()} SOL
    Output: ~${minTokensFromBuy.toString()} tokens              
                                                                
   SELL SWAP (Token  SOL):                                  
    Input:  ${new decimal_js_1.default(sellAmount.toString()).div(Math.pow(10, 6)).toString()} tokens
    Output: ~${minSolFromSell.toString()} SOL                   
                                                                
   Transaction Hash:                                         
  ${txId}
                                                                
   Both operations executed atomically in one transaction!   
                                                                

    `);
        return txId;
    }
    catch (error) {
        console.error(`

                ATOMIC SWAP FAILED!                           

    `);
        if (error instanceof Error) {
            console.error('Error:', error.message);
            console.error('Stack:', error.stack);
        }
        else {
            console.error('Unknown error:', error);
        }
        throw error;
    }
});
// Main execution
const params = parseArgs();
atomicBuySell(params)
    .then((txId) => {
    if (txId) {
        console.log('\n Transaction successfully recorded!');
    }
    process.exit(0);
})
    .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=atomicSwap.js.map