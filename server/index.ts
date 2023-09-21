import express from 'express'
import cors from 'cors'
import path from 'path'
import { readFile, generateMathRandom } from './utils/index'
interface Item {
    id?: number;
    name?: string;
    date?: string;
    address?: string;
}
const app = express()
const port = 9527
const corsOptions = {
    origin: 'http://localhost:8888',
    methods: 'GET,POST,PUT,DELETE,PATCH'
}
app.use(cors(corsOptions)) // 处理跨域
app.use(express.urlencoded({ extended: true })) // 处理request中的数据
app.use(express.json()); // 处理request中的数据
app.use((req, res, next) => {
    res.setHeader('Content-type', 'application/json') // 设置全局的Content-type
    next()
})

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
    const { id, name, date, address } = req.body
    readFile(path.resolve(__dirname, './data/resource.json')).then(data => {
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

app.listen(port, () => {
    console.log(`Your app listening on port http://localhost:${port}`)
})