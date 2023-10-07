import { PutObjectData, PutResult, StorageApi, StorageObject } from '../types';
import path from 'path';
import { open, access, mkdir } from 'fs/promises';
import { ReadStream } from 'fs';
import {ReadableStream} from 'node:stream/web'

const BASEPATH = process.env.LOCAL_STORAGE_FOLDER as string;

export class LocalStorageApi implements StorageApi {
    async getObject(uri: string): Promise<StorageObject> {
        const {fullpath} = this.handlePaths(uri);
        const file = await open(fullpath);
        const readStream = file.readableWebStream();
        return {stream: readStream, contentLength: file.stat.length} as StorageObject;
    }

    async putObject(data: PutObjectData, uri: string): Promise<PutResult> {
        try {
            const {fullpath, dirname}  = this.handlePaths(uri);
            try {
                await access(dirname);
            } catch (e) {
                await mkdir(dirname, {recursive: true});
            }
            const file = await open(fullpath, 'w');
            if (data instanceof ArrayBuffer) {
                console.log('data is ArrayBuffer');
                const rawData = new Uint8Array(data);
                await file.write(rawData);
            } 

            if (data instanceof ReadableStream) {
                console.log('data is ReadableStream');
                const readableStream = data as ReadableStream;
                const writeStream = file.createWriteStream();
                for await (const chunk of readableStream) {
                    writeStream.write(chunk);
                }
                writeStream.end();
            }
            if (data instanceof ReadStream) {
                console.log('data is ReadStream');
                const readStream = data as ReadStream;
                const writeStream = file.createWriteStream();
                readStream.pipe(writeStream);
            }
            
            file.close();
        } catch (e: any) {
            console.log(e);
            return {status: 'FAILED', error: e}
        }
        console.log('putObject', uri);
        
        return {status: 'OK'};
    }

    createPath(...pathSegments: string[]): string {
        console.log('create path: ', ... pathSegments);
        return path.join(...pathSegments);
    }

    handlePaths(uri: string) {
        console.log('handlePaths: ', process.env.LOCAL_STORAGE_FOLDER, uri);
        const fullpath = this.createPath(process.env.LOCAL_STORAGE_FOLDER as string, uri);
        const dirname = path.dirname(fullpath);

        return {fullpath, dirname};
    }
}