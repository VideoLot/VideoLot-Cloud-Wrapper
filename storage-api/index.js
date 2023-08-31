"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorageApi = void 0;
const types_1 = require("../types");
const selectel_api_1 = require("./selectel-api");
function createStorageApi() {
    const provider = process.env.STORAGE_PROVIDER;
    if (!provider) {
        throw Error('Storage provider is not configured');
    }
    switch (provider) {
        case types_1.ServiceProvider.Selectel:
            return new selectel_api_1.SelectelStorageApi();
        default:
            throw new Error(`Storage is not implemented for provider: ${provider}`);
    }
}
exports.createStorageApi = createStorageApi;
