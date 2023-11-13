import path from 'path'
import { Express, Request, Response } from 'express'
import { readFile, generateMathRandom, buffer2String } from '../utils/index'
import { DataItem, Item } from '../types/tableSelection'


export default function (app: Express, prefix = "rsg") {
    app.get(`/${prefix}/resource`, (req: Request, res: Response) => {
        readFile(path.resolve(__dirname, '../data/resource.json')).then(data => {
            res.end(data)
        }).catch(err => {
            res.end(err)
        })
    })
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
    app.post(`/${prefix}/resource/save`, (req: Request, res: Response) => {
        const { id, name, date, address } = req.body
        readFile(path.resolve(__dirname, '../data/resource.json')).then(data => {
            const resource = JSON.parse(data as string)
            const resourceData: Item[] = resource.data
            let target: Item
            if (id) {
                target = resourceData.find(item => item.id === id) as Item
                target.name = name
                target.date = date
                target.address = address
            } else {
                target = {
                    id: generateMathRandom(1, 9999999),
                    name,
                    date,
                    address
                }
                resource.data.push(target)
            }
            const targetJsonString = JSON.stringify(target)
            res.end(targetJsonString, 'utf-8')
        }).catch(err => {
            res.end(err)
        })
    })
}