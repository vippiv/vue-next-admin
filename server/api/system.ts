import path from 'path'
import { Express, Request, Response } from 'express'
import { readFile } from '../utils/index'

export default function (app: Express, prefix = "system") {
    app.get(`/${prefix}/adminMenu`, (req: Request, res: Response) => {
        readFile(path.resolve(__dirname, '../data/adminMenu.json')).then(data => {
            res.end(data)
        }).catch(err => {
            res.end(err)
        })
    })
}