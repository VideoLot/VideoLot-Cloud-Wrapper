import { S3Client, S3ClientConfig, GetObjectCommand } from '@aws-sdk/client-s3';
import { StorageApi, StorageObject } from './storage-api';

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

export class SelectelStorageApi implements StorageApi {
    async getObject(uri: string): Promise<StorageObject> {
        const getObjectCommand = new GetObjectCommand({
            Bucket: 'MediaStorage',
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

}