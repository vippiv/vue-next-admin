import express from 'express'
import cors from 'cors'
import requests from './api/index'
import appConfig from './config/index'

const app = express()
const port = 9527
app.use(cors(appConfig.corsOptions)) // 处理跨域
app.use(express.urlencoded({ extended: true })) // 处理request中的数据
app.use(express.json()); // 处理request中的数据
app.use((req, res, next) => {
    res.setHeader('Content-type', 'application/json') // 设置全局的Content-type
    next()
})

requests(app)

app.listen(port, () => {
    console.log(`Your app listening on port http://localhost:${port}`)
})
