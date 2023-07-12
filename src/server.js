const express = require('express')
const routes = require('./routes')
const server = express()

const port = 3333

server.use(express.json())

server.use(routes)

server.listen(port, () => { console.log(`Servidor rodando na porta ${port}`)})