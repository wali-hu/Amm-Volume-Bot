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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPoolLiquidity = void 0;
const config_1 = require("../config");
const checkPoolLiquidity = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Checking Pool Liquidity...');
    const raydium = yield (0, config_1.initSdk)();
    // Our new pool ID
    const poolId = 'DdsMQzVueB5L7Rn5hMkzSz2BFCnQyVXbnA5cMUimT92C';
    try {
        // Method 1: Check via API
        console.log('Fetching pool data via API...');
        const poolData = yield raydium.api.fetchPoolById({ ids: poolId });
        if (poolData && poolData.length > 0) {
            const pool = poolData[0];
            console.log('Pool found!');
            console.log('Pool ID:', pool.id);
            console.log('Pool Type:', pool.type);
            console.log('TVL:', pool.tvl);
            console.log('Volume 24h:', (_a = pool.day) === null || _a === void 0 ? void 0 : _a.volume);
            if (pool.type === 'Standard') {
                console.log('Base Token:', pool.mintA.symbol, pool.mintA.address);
                console.log('Quote Token:', pool.mintB.symbol, pool.mintB.address);
                console.log('LP Amount:', pool.lpAmount);
                console.log('LP Price:', pool.lpPrice);
            }
        }
        else {
            console.log('Pool not found in API');
        }
        // Method 2: Check via RPC
        console.log('\nFetching pool data via RPC...');
        const rpcData = yield raydium.liquidity.getPoolInfoFromRpc({ poolId });
        console.log('RPC Pool Keys:', Object.keys(rpcData));
        if (rpcData.poolInfo) {
            console.log('Pool Info available via RPC');
        }
    }
    catch (error) {
        console.error('Error checking pool:', error);
    }
});
exports.checkPoolLiquidity = checkPoolLiquidity;
(0, exports.checkPoolLiquidity)().catch(console.error);
//# sourceMappingURL=checkPool.js.map