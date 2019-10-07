const express=require('express')
const cors=require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8888
const db=require('./db')

const userRouter=require('./user/router')

const corsMiddleware = cors()
app.use(corsMiddleware)
app.use(bodyParser.json())
app.use(userRouter)

app.get('/test', (request, response)=>response.send('hi there'))

app.listen(port, () => console.log(`App listening on port ${port}!`))
