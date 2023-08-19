export type StorageObject = {
    stream: ReadableStream<Buffer>,
    contentLength: number
}

export interface StorageApi {
    getObject(uri: string): Promise<StorageObject>
}