import { S3Client, S3ClientConfig, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { StorageApi, StorageObject, PutResult } from '../types';
import { ReadStream } from 'fs';

const client = new S3Client({
    credentials: {
        accessKeyId: `${process.env.SELECTEL_ACCOUNT_ID}_${process.env.SELECTEL_USERNAME}`,
        secretAccessKey: process.env.SELECTEL_PASSWORD
    },
    endpoint: 'https://s3.storage.selcloud.ru',
    s3ForcePathStyle: true,
    region: 'ru-1',
    apiVersion: 'latest'
} as S3ClientConfig);

const BUCKET_NAME = process.env.SELECTEL_MEDIA_BUCKET;

export class SelectelStorageApi implements StorageApi {
    async getObject(uri: string): Promise<StorageObject> {
        const getObjectCommand = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uri,
        });
        const result = await client.send(getObjectCommand);
        if (!result.Body) {
            throw new Error();
        }
        return {
            stream: result.Body.transformToWebStream(),
            contentLength: result.ContentLength as number
        };   
    }

    async putObject(stream: ReadableStream, uri: string): Promise<PutResult> {
        const putObjectCommand = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uri,
            Body: stream
        });

        try {
            await client.send(putObjectCommand);
            return {
                status: 'OK'
            };
        } catch (error: any) {
            return {
                status: 'FAILED',
                error: error
            };
        }
    }

    createPath(...path: string[]): string {
        const result = [];
        for (const segment of path) {
            let start = 0
            let end = undefined;
            if (segment.startsWith('/')) {
                start = 1;
            }
            if (segment.endsWith('/')) {
                end = segment.length - 2;
            }
            const resultSegment = segment.slice(start, end);
            result.push(resultSegment);
        }
        
        return result.join('/');
    }

}