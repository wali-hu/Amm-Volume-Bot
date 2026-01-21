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
exports.createMarketOnly = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const spl_token_1 = require("@solana/spl-token");
const config_1 = require("../config");
const createMarketOnly = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(' Creating Market on Devnet...');
    console.log('Wallet:', config_1.owner.publicKey.toBase58());
    const raydium = yield (0, config_1.initSdk)();
    // Step 1: Create a simple token
    console.log(' Creating custom token...');
    const customMint = yield (0, spl_token_1.createMint)(config_1.connection, config_1.owner, config_1.owner.publicKey, null, // No freeze authority
    6 // 6 decimals
    );
    console.log(' Custom token created:', customMint.toBase58());
    // Step 2: Create market
    console.log(' Creating market...');
    try {
        const { execute, extInfo } = yield raydium.marketV2.create({
            baseInfo: {
                mint: raydium_sdk_v2_1.WSOLMint,
                decimals: 9,
            },
            quoteInfo: {
                mint: customMint,
                decimals: 6,
            },
            lotSize: 1,
            tickSize: 0.01,
            dexProgramId: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.OPEN_BOOK_PROGRAM,
            txVersion: config_1.txVersion,
            computeBudgetConfig: {
                units: 600000,
                microLamports: 100000000, // Higher priority fee
            },
        });
        const txIds = yield execute({ sequentially: true });
        console.log(' Market created successfully!');
        console.log(' Market ID:', extInfo.address.marketId.toBase58());
        console.log(' Transaction Hashes:', txIds);
        console.log(' Custom Token:', customMint.toBase58());
        return {
            marketId: extInfo.address.marketId.toBase58(),
            txHashes: txIds,
            customToken: customMint.toBase58()
        };
    }
    catch (error) {
        console.error(' Error:', error);
        throw error;
    }
});
exports.createMarketOnly = createMarketOnly;
// Execute
(0, exports.createMarketOnly)()
    .then((result) => {
    console.log('\n SUCCESS! Market Created:');
    console.log('Market ID:', result.marketId);
    console.log('Transaction Hashes:', result.txHashes);
    console.log('Custom Token:', result.customToken);
    console.log('\n Next Steps:');
    console.log('1. Use this Market ID to create an AMM pool');
    console.log('2. Market ID:', result.marketId);
})
    .catch((error) => {
    console.error(' Failed to create market:', error.message || error);
});
//# sourceMappingURL=createMarketOnly.js.map