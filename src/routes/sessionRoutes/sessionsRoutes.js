const { Router } = require('express')
const sessionRoutes = Router()

const SessionsControllers = require('../../controllers/sessionControllers')
const sessionControllers = new SessionsControllers

sessionRoutes.post('/',  sessionControllers.create)

module.exports = sessionRoutes