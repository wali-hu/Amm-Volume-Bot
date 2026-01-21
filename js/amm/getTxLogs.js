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
const getTxLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const txId = 'M79Pmys4UUjNwheHEe8JTjYQ4CYWyqwcQH6Fg7PHwZ3ocgnGgaNV378yVMY7twL5j3KvR8qV14QxqJGx1rmnFPi';
    const txDetails = yield config_1.connection.getTransaction(txId, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
    });
    console.log(' Transaction Error:', (_a = txDetails === null || txDetails === void 0 ? void 0 : txDetails.meta) === null || _a === void 0 ? void 0 : _a.err);
    console.log(' Log Messages:');
    (_c = (_b = txDetails === null || txDetails === void 0 ? void 0 : txDetails.meta) === null || _b === void 0 ? void 0 : _b.logMessages) === null || _c === void 0 ? void 0 : _c.forEach((log, i) => {
        console.log(`${i}: ${log}`);
    });
});
getTxLogs().catch(console.error);
//# sourceMappingURL=getTxLogs.js.map