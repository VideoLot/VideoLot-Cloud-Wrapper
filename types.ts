import { ReadStream } from "fs";

 export enum ServiceProvider {
    Local = 'local',
    Selectel = 'selectel'
}

export type PutObjectData = ReadStream | ReadableStream | ArrayBuffer;
export type S3CompatibleTypes = ReadStream | ReadableStream | Uint8Array;

export interface StorageApi {
    getObject(uri: string): Promise<StorageObject>
    putObject(data: PutObjectData, uri: string): Promise<PutResult>
    /*
    * return platform specific absolute path
    */
    createPath(...path: string[]): string;
}

export type StorageObject = {
    stream: ReadableStream,
    contentLength: number
}

export type PutResult = {
    status: 'OK' | 'FAILED',
    error?: Error
};