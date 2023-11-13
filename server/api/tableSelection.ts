import path from 'path'
import { Express, Request, Response } from 'express'
import { readFile, buffer2String } from '../utils/index'
import { DataItem } from '../types/tableSelection'

export default function (app: Express, prefix = "tableSelection") {
    app.get(`/${prefix}/table`, (req: Request, res: Response) => {
        const { name, pageNum } = req.query
        const page = pageNum || 1
        readFile(path.resolve(__dirname, `../data/table/table${page}.json`)).then(data => {
            if (name) {
                const jsonData = JSON.parse(buffer2String(data as Buffer))
                const entityData = jsonData.data.filter((item: DataItem) => item.name.includes(name as string))
                jsonData.total = entityData.length
                jsonData.data = entityData
                res.end(Buffer.from(JSON.stringify(jsonData), 'utf8'))
            } else {
                res.end(data)

            }
        }).catch(err => {
            res.end(err)
        })
    })
    app.get(`/${prefix}/tableResource`, (req: Request, res: Response) => {
        readFile(path.resolve(__dirname, '../data/table/list.json')).then(data => {
            res.end(data)
        }).catch(err => {
            res.end(err)
        })
    })
}