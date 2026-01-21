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
const performSwap = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)({ loadToken: true });
    const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C';
    console.log(' Fetching pool information...');
    try {
        // Fetch pool data via API
        const poolData = yield raydium.api.fetchPoolById({ ids: poolId });
        if (!poolData || poolData.length === 0) {
            console.error(' Pool not found');
            return;
        }
        const pool = poolData[0];
        console.log(' Pool found!');
        console.log('Pool ID:', pool.id);
        console.log('TVL:', pool.tvl);
        console.log('Base Token:', pool.mintA.symbol, '-', pool.mintA.address);
        console.log('Quote Token:', pool.mintB.symbol, '-', pool.mintB.address);
        // Get pool info from RPC
        const rpcData = yield raydium.liquidity.getPoolInfoFromRpc({ poolId });
        const poolInfo = rpcData.poolInfo;
        const poolKeys = rpcData.poolKeys;
        // Input amount: 0.1 SOL
        const inputAmount = new bn_js_1.default('100000000');
        const inputMint = pool.mintA.address; // SOL
        console.log('\n Computing swap amount...');
        // Calculate output amount with slippage
        const { amountOut, minAmountOut, priceImpact } = raydium.liquidity.computeAmountOut({
            poolInfo,
            amountIn: inputAmount,
            mintIn: inputMint,
            mintOut: pool.mintB.address,
            slippage: 0.05,
        });
        console.log('Input: 0.1 SOL');
        console.log('Expected Output:', new decimal_js_1.default(amountOut.toString()).div(Math.pow(10, 6)).toString(), 'tokens');
        console.log('Min Output (5% slippage):', new decimal_js_1.default(minAmountOut.toString()).div(Math.pow(10, 6)).toString(), 'tokens');
        console.log('Price Impact:', priceImpact.toFixed(4), '%');
        console.log('\n Setting up swap...');
        // Now perform the swap with computed amountOut
        const { execute } = yield raydium.liquidity.swap({
            poolInfo,
            poolKeys,
            inputMint,
            amountIn: inputAmount,
            amountOut: minAmountOut, // Use min amount with slippage
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
        console.log(' Swap instruction prepared');
        console.log(' Executing transaction...');
        const { txId } = yield execute({ sendAndConfirm: true });
        console.log('\n SWAP SUCCESSFUL!');
        console.log('Transaction Hash:', txId);
        return txId;
    }
    catch (error) {
        console.error(' Swap failed:');
        if (error instanceof Error) {
            console.error('Error:', error.message);
            if (error.stack)
                console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
        }
        else {
            console.error(error);
        }
        throw error;
    }
});
performSwap()
    .then((txHash) => {
    if (txHash) {
        console.log('\n Complete! Transaction:', txHash);
    }
})
    .catch(console.error);
//# sourceMappingURL=testSwap.js.map