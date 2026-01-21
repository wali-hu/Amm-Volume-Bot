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
const config_1 = require("../config");
const inspect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, config_1.initSdk)({ loadToken: true });
    const data = yield (0, config_1.fetchTokenAccountData)();
    console.log('Token Accounts:');
    data.tokenAccounts.forEach((token, i) => {
        console.log(`\n${i}. Mint: ${token.mint.toBase58()}`);
        console.log(`   Amount: ${token.amount.toString()}`);
        console.log(`   Is Native: ${token.isNative}`);
        console.log(`   Is Associated: ${token.isAssociated}`);
    });
});
inspect().catch(console.error);
//# sourceMappingURL=inspect.js.map