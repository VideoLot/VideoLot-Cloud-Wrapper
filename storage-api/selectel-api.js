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
exports.SelectelStorageApi = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: `${process.env.SELECTEL_ACCOUNT_ID}_${process.env.SELECTEL_USERNAME}`,
        secretAccessKey: process.env.SELECTEL_PASSWORD
    },
    endpoint: 'https://s3.storage.selcloud.ru',
    s3ForcePathStyle: true,
    region: 'ru-1',
    apiVersion: 'latest'
});
const BUCKET_NAME = process.env.SELECTEL_MEDIA_BUCKET;
class SelectelStorageApi {
    getObject(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const getObjectCommand = new client_s3_1.GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: uri,
            });
            const result = yield client.send(getObjectCommand);
            if (!result.Body) {
                throw new Error();
            }
            return {
                stream: result.Body.transformToWebStream(),
                contentLength: result.ContentLength
            };
        });
    }
    putObject(data, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let stream = data;
            if (data instanceof ArrayBuffer) {
                stream = new Uint8Array(data);
            }
            const putObjectCommand = new client_s3_1.PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: uri,
                Body: stream
            });
            try {
                yield client.send(putObjectCommand);
                return {
                    status: 'OK'
                };
            }
            catch (error) {
                return {
                    status: 'FAILED',
                    error: error
                };
            }
        });
    }
    createPath(...path) {
        const result = [];
        for (const segment of path) {
            let start = 0;
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
exports.SelectelStorageApi = SelectelStorageApi;
