1. <el-table>上必须设置 row-key="id"，id 是唯一的 key
2. type="selection"的<el-table-column></el-table-column>上必须设置:reserve-selection="true"
3. 数据回显时，必须设置锁，防止以前选的数据被篡改，这里的字段是 isTrigerTableChangeEvent
4. chooseList 数据必须全部调用 toggleRowSelection 方法，这是保证组件内部存储已选择的数据
5. 删除数据时必须先 clearSelection 一下，不然会在操作两次时数据错乱
