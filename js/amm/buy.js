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
/**
 * BUY Script: Swap SOL  Custom Token
 * This script swaps SOL (base token) for custom tokens (quote token)
 */
const buyTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)({ loadToken: true });
    const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C';
    console.log(`

                     BUY TOKENS (SOL  Token)                

  `);
    try {
        // Fetch pool data
        console.log(' Fetching pool information...');
        const poolData = yield raydium.api.fetchPoolById({ ids: poolId });
        if (!poolData || poolData.length === 0) {
            console.error(' Pool not found');
            return;
        }
        const pool = poolData[0];
        console.log(' Pool found!');
        console.log(`   Base Token: ${pool.mintA.symbol} (${pool.mintA.address})`);
        console.log(`   Quote Token: ${pool.mintB.symbol || 'Custom'} (${pool.mintB.address})`);
        // Get pool info from RPC
        const rpcData = yield raydium.liquidity.getPoolInfoFromRpc({ poolId });
        const poolInfo = rpcData.poolInfo;
        const poolKeys = rpcData.poolKeys;
        // Buy 0.1 SOL worth of tokens
        const inputAmount = new bn_js_1.default('100000000'); // 0.1 SOL (100M lamports)
        const inputMint = pool.mintA.address; // SOL
        console.log(`
 Swap Details:
   Input: 0.1 SOL
   Slippage: 5%
   `);
        // Calculate output
        console.log(' Computing swap amount...');
        const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
            poolInfo,
            amountIn: inputAmount,
            mintIn: inputMint,
            mintOut: pool.mintB.address,
            slippage: 0.05,
        });
        const expectedTokens = new decimal_js_1.default(amountOut.toString()).div(Math.pow(10, 6));
        const minTokens = new decimal_js_1.default(minAmountOut.toString()).div(Math.pow(10, 6));
        console.log(` Computation Done:
   Expected Output: ${expectedTokens.toString()} tokens
   Min Output (5% slippage): ${minTokens.toString()} tokens
   Price Impact: ${priceImpact.toFixed(4)}%
    `);
        // Execute swap
        console.log(' Creating swap instruction...');
        const { execute } = yield raydium.liquidity.swap({
            poolInfo,
            poolKeys,
            inputMint,
            amountIn: inputAmount,
            amountOut: minAmountOut,
            fixedSide: 'in',
            txVersion: config_1.txVersion,
            config: {
                inputUseSolBalance: true,
                outputUseSolBalance: false,
            },
            computeBudgetConfig: {
                units: 600000,
                microLamports: 100000000,
            },
        });
        console.log(' Executing transaction...\n');
        const { txId } = yield execute({ sendAndConfirm: true });
        console.log(`

                       BUY SUCCESSFUL!                        

                                                                
  Transaction Hash:                                            
  ${txId}
                                                                
  You received: ~${minTokens.toString()} tokens                 
                                                                

    `);
        return txId;
    }
    catch (error) {
        console.error(`

                     BUY FAILED!                              

    `);
        if (error instanceof Error) {
            console.error('Error:', error.message);
        }
        else {
            console.error(error);
        }
        throw error;
    }
});
buyTokens()
    .then((txHash) => {
    if (txHash) {
        console.log('\n Save this transaction hash for records!');
    }
    process.exit(0);
})
    .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=buy.js.map