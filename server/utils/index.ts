import fs from 'fs'
import crypto from 'crypto'

export function readFile(path: string) {
    return new Promise((reslove, reject) => {
        fs.readFile(path, (err, data: Buffer) => {
            if (err) {
                reject(err)
            }
            reslove(data)
        })
    })
}

export function resDataStructure(statusCode: number, data: any) {
    return {
        code: 0,
        statusCode,
        data
    }
}

export function generateMathRandom(min: number, max: number) {
    const buffer = crypto.randomBytes(4); // 4 bytes for a 32-bit integer
    const randomValue = buffer.readUInt32LE(0); // Convert bytes to an integer
    return Math.floor(randomValue / 0xFFFFFFFF * (max - min + 1)) + min;
}

export function buffer2String(data: Buffer): string {
    return data.toString('utf-8')
}