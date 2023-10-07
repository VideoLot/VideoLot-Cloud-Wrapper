import { ServiceProvider, StorageApi } from "../types";
import { SelectelStorageApi } from "./selectel-api";
import { LocalStorageApi } from './local-api';

export function createStorageApi(): StorageApi {
    const provider = process.env.STORAGE_PROVIDER as unknown as ServiceProvider;
    if (!provider) {
        throw Error('Storage provider is not configured');
    }

    switch (provider) {
        case ServiceProvider.Selectel:
            return new SelectelStorageApi();
        case ServiceProvider.Local:
            return new LocalStorageApi();
        default:
            throw new Error(`Storage is not implemented for provider: ${provider}`);
    }
}