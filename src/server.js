require('express-async-errors')
require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const AppError = require('./utils/AppError')
const uploadConfigs = require('./configs/upload')
const server = express()
const cors = require('cors')

const port = process.env.PORT || 3333

server.use(cors())
server.use(express.json())

server.use('/files', express.static(uploadConfigs.UPLOADS_FOLDER))

server.use(routes)
server.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ status: 'error', message: error.message})

    } 
    console.error(error)

    return res.status(500).json({ status: 'error', message: 'Internal server error' })
})


server.listen(port, () => { console.log(`Servidor rodando na porta ${port}`)})