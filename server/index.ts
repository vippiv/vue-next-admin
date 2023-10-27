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
interface DataItem {
    name: string;
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

app.get('/tableResource', (req, res) => {
    readFile(path.resolve(__dirname, './data/table/list.json')).then(data => {
        res.end(data)
    }).catch(err => {
        res.end(err)
    })
})

app.get('/table', (req, res) => {
    const { name, pageNum } = req.query
    const page = pageNum || 1
    readFile(path.resolve(__dirname, `./data/table/table${page}.json`)).then(data => {
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

function buffer2String(data: Buffer): string {
    return data.toString('utf-8')
}