import { Express, Request, Response } from 'express'

export default function (app: Express, prefix = "") {
    app.get(`${prefix}/`, (req: Request, res: Response) => {
        res.end('hello world')
    })
}