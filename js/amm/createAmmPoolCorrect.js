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
exports.createAmmPoolFinal = void 0;
const raydium_sdk_v2_1 = require("@raydium-io/raydium-sdk-v2");
const config_1 = require("../config");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const createAmmPoolFinal = () => __awaiter(void 0, void 0, void 0, function* () {
    const raydium = yield (0, config_1.initSdk)();
    const marketId = new web3_js_1.PublicKey('qNETQX7roK2UgPNn3K49hffT6b4rfrAnowqMUHqWUm5'); // New market
    const marketBufferInfo = yield raydium.connection.getAccountInfo(marketId);
    const { baseMint, quoteMint } = raydium_sdk_v2_1.MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo.data);
    const baseMintInfo = yield raydium.token.getTokenInfo(baseMint);
    const quoteMintInfo = yield raydium.token.getTokenInfo(quoteMint);
    console.log('Base mint:', baseMint.toBase58(), 'decimals:', baseMintInfo.decimals);
    console.log('Quote mint:', quoteMint.toBase58(), 'decimals:', quoteMintInfo.decimals);
    const { execute, extInfo } = yield raydium.liquidity.createPoolV4({
        programId: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.AMM_V4,
        marketInfo: {
            marketId,
            programId: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.OPEN_BOOK_PROGRAM,
        },
        baseMintInfo: {
            mint: baseMint,
            decimals: baseMintInfo.decimals,
        },
        quoteMintInfo: {
            mint: quoteMint,
            decimals: quoteMintInfo.decimals,
        },
        baseAmount: new bn_js_1.default('5000000000'), // 5 SOL (5e9 lamports)
        quoteAmount: new bn_js_1.default('5000000000'), // 5000 tokens (5e9 units for 6 decimals)
        startTime: new bn_js_1.default(0),
        ownerInfo: {
            useSOLBalance: true,
        },
        associatedOnly: false,
        txVersion: config_1.txVersion,
        feeDestinationId: raydium_sdk_v2_1.DEVNET_PROGRAM_ID.FEE_DESTINATION_ID,
        computeBudgetConfig: {
            units: 600000,
            microLamports: 100000000,
        },
    });
    const { txId } = yield execute({ sendAndConfirm: true });
    console.log(' AMM pool created! txId:', txId);
    console.log(' Pool ID:', extInfo.address.ammId.toBase58());
    return {
        poolId: extInfo.address.ammId.toBase58(),
        txHash: txId
    };
});
exports.createAmmPoolFinal = createAmmPoolFinal;
(0, exports.createAmmPoolFinal)()
    .then((result) => {
    console.log('\n SUCCESS!');
    console.log('Pool ID:', result.poolId);
    console.log('Transaction Hash:', result.txHash);
})
    .catch((error) => {
    console.error(' Failed:', error);
});
//# sourceMappingURL=createAmmPoolCorrect.js.map