const express=require('express')
const cors=require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8888

const corsMiddleware = cors()
app.use(corsMiddleware)
app.use(bodyParser.json())

app.listen(port, () => console.log(`App listening on port ${port}!`))
