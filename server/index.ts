import express from 'express'
import cors from 'cors'
import path from 'path'
import { readFile } from './utils/index'
const app = express()
const port = 9527
const corsOptions = {
    origin: 'http://localhost:8888',
    methods: 'GET,POST,PUT,DELETE,PATCH'
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.end('hello world')
})

app.get('/adminMenu', (req, res) => {
    readFile(path.resolve(__dirname, './data/adminMenu.json')).then(data => {
        res.end(data)
    }).catch(err => {
        res.end(err)
    })
})

app.get('/resource', (req, res) => {
    readFile(path.resolve(__dirname, './data/resource.json')).then(data => {
        res.end(data)
    }).catch(err => {
        res.end(err)
    })
})

app.post('/resource/save', (req, res) => {
    const { id, name, date, address } = req.query
    console.log("🚀 ~ file: index.ts:35 ~ app.post ~ req:", id, name, date, address)
})

app.listen(port, () => {
    console.log(`Your app listening on port http://localhost:${port}`)
})