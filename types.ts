export enum ServiceProvider {
    Local = 'local',
    Selectel = 'selectel'
}

export interface StorageApi {
    getObject(uri: string): Promise<StorageObject>
    putObject(stream: ReadableStream, uri: string): Promise<PutResult>;
}

export type StorageObject = {
    stream: ReadableStream<Buffer>,
    contentLength: number
}

export type PutResult = {
    status: 'OK' | 'FAILED',
    error?: Error
};