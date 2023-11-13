import { Express } from 'express'
import tableSelectionApi from './tableSelection'
import systemApi from './system'
import resourceApi from './resource'
import defaultApi from './default'

export default function (app: Express) {
    defaultApi(app)
    tableSelectionApi(app)
    systemApi(app)
    resourceApi(app)
}