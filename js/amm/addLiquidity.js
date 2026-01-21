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
exports.addLiquiditySimple = void 0;
const config_1 = require("../config");
const bn_js_1 = __importDefault(require("bn.js"));
const addLiquiditySimple = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Adding Liquidity to Existing Pool...');
    const raydium = yield (0, config_1.initSdk)();
    // Our existing pool details
    const poolId = 'D869DJYsXgyQrBCoc8CEfehwc7jy7MRCKog4L4RA637E';
    console.log('Pool ID:', poolId);
    try {
        // Get pool info via RPC (this works from our previous tests)
        console.log('Getting pool info from RPC...');
        const poolData = yield raydium.liquidity.getPoolInfoFromRpc({ poolId });
        console.log('Pool data retrieved successfully');
        console.log('Pool keys available:', Object.keys(poolData));
        // Use the poolInfo from RPC data
        const poolInfo = poolData.poolInfo;
        const poolKeys = poolData.poolKeys;
        console.log('Pool Info ID:', poolInfo.id);
        console.log('Pool Type:', poolInfo.type);
        // Define amounts to add (smaller amounts to avoid issues)
        const baseAmountBN = new bn_js_1.default('100000000'); // 0.1 SOL
        const quoteAmountBN = new bn_js_1.default('100000000'); // 100 tokens (6 decimals)
        console.log('Adding liquidity:');
        console.log('Base amount:', baseAmountBN.div(new bn_js_1.default(Math.pow(10, 9))).toString(), 'SOL');
        console.log('Quote amount:', quoteAmountBN.div(new bn_js_1.default(Math.pow(10, 6))).toString(), 'tokens');
        // Create the add liquidity transaction
        const { execute, extInfo } = yield raydium.liquidity.addLiquidity({
            poolInfo: poolInfo, // Type assertion to bypass strict typing
            poolKeys,
            amountInA: {
                token: poolInfo.mintA,
                amount: baseAmountBN
            },
            amountInB: {
                token: poolInfo.mintB,
                amount: quoteAmountBN
            },
            otherAmountMin: {
                token: poolInfo.mintB,
                amount: new bn_js_1.default('90000000') // 90 tokens minimum (10% slippage)
            },
            fixedSide: 'a',
            txVersion: config_1.txVersion,
            computeBudgetConfig: {
                units: 600000,
                microLamports: 100000000,
            },
        });
        console.log('Executing add liquidity transaction...');
        // Execute the transaction
        const result = yield execute({ sendAndConfirm: true });
        console.log('SUCCESS!');
        console.log('Add Liquidity Transaction Hash:', result.txId);
        if (extInfo === null || extInfo === void 0 ? void 0 : extInfo.lpAmount) {
            console.log('LP Tokens Received:', extInfo.lpAmount.toString());
        }
        return {
            txId: result.txId,
            poolId: poolId,
            lpAmount: ((_a = extInfo === null || extInfo === void 0 ? void 0 : extInfo.lpAmount) === null || _a === void 0 ? void 0 : _a.toString()) || 'Unknown'
        };
    }
    catch (error) {
        console.error('Add liquidity failed:', error);
        // If it's a transaction error, try to get more details
        if (error.txId) {
            console.log('Transaction ID for debugging:', error.txId);
        }
        throw error;
    }
});
exports.addLiquiditySimple = addLiquiditySimple;
// Execute the function
(0, exports.addLiquiditySimple)()
    .then((result) => {
    console.log('\n=== FINAL RESULT ===');
    console.log('Pool ID:', result.poolId);
    console.log('Transaction Hash:', result.txId);
    console.log('LP Tokens:', result.lpAmount);
    console.log('===================');
})
    .catch((error) => {
    console.error('\n=== FAILED ===');
    console.error('Error:', error.message);
    console.error('=============');
});
//# sourceMappingURL=addLiquidity.js.map