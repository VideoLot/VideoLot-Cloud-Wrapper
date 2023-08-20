export enum ServiceProvider {
    Local = 'local',
    Selectel = 'selectel'
}


export interface StorageApi {
    getObject(uri: string): Promise<StorageObject>
}

export type StorageObject = {
    stream: ReadableStream<Buffer>,
    contentLength: number
}