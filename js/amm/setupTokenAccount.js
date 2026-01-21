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
exports.setupTokenAccount = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
const setupTokenAccount = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(' Setting up token account...');
    // New custom token from market creation
    const customToken = new web3_js_1.PublicKey('8XG9JQF5ajQB3DXC2ANMJyo9QBzSovwEorH9EeRzzCgo');
    try {
        console.log(' Token mint:', customToken.toString());
        // Check if mint exists first
        const mintInfo = yield config_1.connection.getAccountInfo(customToken);
        if (!mintInfo) {
            throw new Error('Token mint does not exist');
        }
        console.log(' Token mint exists');
        // Create associated token account (will create if doesn't exist)
        const tokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(config_1.connection, config_1.owner, // payer
        customToken, // mint
        config_1.owner.publicKey // owner
        );
        console.log(' Token account:', tokenAccount.address.toBase58());
        // Mint tokens to the account (increase amount for pool)
        const mintAmount = 10000 * Math.pow(10, 6); // 10,000 tokens with 6 decimals
        console.log('Creating token account...');
        const mintTx = yield (0, spl_token_1.mintTo)(config_1.connection, config_1.owner, // payer
        customToken, // mint
        tokenAccount.address, // destination
        config_1.owner, // mint authority (wallet is the authority)
        mintAmount);
        console.log(` Minted ${mintAmount / Math.pow(10, 6)} tokens`);
        console.log(' Mint transaction:', mintTx);
        // Verify balance
        const accountInfo = yield (0, spl_token_1.getAccount)(config_1.connection, tokenAccount.address);
        console.log(' Token balance:', accountInfo.amount.toString());
        return {
            tokenAccount: tokenAccount.address.toBase58(),
            mintTx: mintTx,
            balance: accountInfo.amount.toString()
        };
    }
    catch (error) {
        console.error(' Error:', error);
        throw error;
    }
});
exports.setupTokenAccount = setupTokenAccount;
// Execute
(0, exports.setupTokenAccount)()
    .then((result) => {
    console.log('\n Token account setup complete!');
    console.log('Token Account:', result.tokenAccount);
    console.log('Balance:', result.balance);
    console.log('Mint Transaction:', result.mintTx);
})
    .catch((error) => {
    console.error(' Failed:', error.message);
});
//# sourceMappingURL=setupTokenAccount.js.map