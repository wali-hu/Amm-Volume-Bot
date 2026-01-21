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
 * SELL Script: Swap Custom Token  SOL
 * This script swaps custom tokens (quote token) for SOL (base token)
 */
const sellTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)({ loadToken: true });
    const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C';
    console.log(`

                    SELL TOKENS (Token  SOL)                

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
        // Sell 10 tokens (6 decimals)
        const inputAmount = new bn_js_1.default('10000000'); // 10 tokens (10 * 1e6)
        const inputMint = pool.mintB.address; // Custom Token
        console.log(`
 Swap Details:
   Input: 10 Custom Tokens
   Slippage: 5%
   `);
        // Calculate output
        console.log(' Computing swap amount...');
        const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
            poolInfo,
            amountIn: inputAmount,
            mintIn: inputMint,
            mintOut: pool.mintA.address,
            slippage: 0.05,
        });
        const expectedSOL = new decimal_js_1.default(amountOut.toString()).div(Math.pow(10, 9));
        const minSOL = new decimal_js_1.default(minAmountOut.toString()).div(Math.pow(10, 9));
        console.log(` Computation Done:
   Expected Output: ${expectedSOL.toString()} SOL
   Min Output (5% slippage): ${minSOL.toString()} SOL
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
                inputUseSolBalance: false,
                outputUseSolBalance: true,
            },
            computeBudgetConfig: {
                units: 600000,
                microLamports: 100000000,
            },
        });
        console.log(' Executing transaction...\n');
        const { txId } = yield execute({ sendAndConfirm: true });
        console.log(`

                      SELL SUCCESSFUL!                        

                                                                
  Transaction Hash:                                            
  ${txId}
                                                                
  You received: ~${minSOL.toString()} SOL                        
                                                                

    `);
        return txId;
    }
    catch (error) {
        console.error(`

                    SELL FAILED!                              

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
sellTokens()
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
//# sourceMappingURL=sell.js.map