const { Router } = require('express')
const dishesRoutes = Router()
const ensureAuthenticate = require('../../middlewares/ensureAuthenticate')
const uploadConfig = require('../../configs/upload')
const multer = require('multer')
const upload = multer(uploadConfig.MULTER) 

const DishesControllers = require('../../controllers/dishesControllers')
const DishImageControllers = require('../../controllers/dishImageControllers')
const dishesControllers = new DishesControllers

const dishImageController = new DishImageControllers

dishesRoutes.use(ensureAuthenticate)

dishesRoutes.post('/', upload.single('image'), dishesControllers.create)
dishesRoutes.delete('/:id', dishesControllers.delete)
dishesRoutes.put('/:id', upload.single('image'), dishesControllers.update)
dishesRoutes.get('/', dishesControllers.index)
dishesRoutes.get('/:id', dishesControllers.show)
dishesRoutes.patch('/image/:id', upload.single('image'), dishImageController.update)

module.exports = dishesRoutes