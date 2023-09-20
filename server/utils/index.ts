import fs from 'fs'
interface responseObject {
    [key: string]: any
}
export function readFile (path: string) {
    return new Promise((reslove, reject) => {
        fs.readFile(path, (err, data: responseObject) => {
            if (err) {
                reject(err)
            }
            reslove(data)
        })
    })
}

export function resDataStructure (statusCode: number, data: any) {
    return {
        code: 0,
        statusCode,
        data
    }
}