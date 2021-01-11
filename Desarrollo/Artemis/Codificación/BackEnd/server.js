require('./config/config')
const express=require('express')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')

const {cors_config}=require('./config/cors_config')
const {multer_config}=require('./config/multer_config')
const {cloudinary_config}=require('./config/cloudinary_config')

const app=express()
require('./config/mongoose_config')

cors_config(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())

multer_config(app)

require('./config/cloudinary_config')

app.use(require('./routes/index'))

app.use(express.static(__dirname+'/public'));

app.listen(process.env.PORT,()=>{
    console.log("Escuchando el puerto",process.env.PORT)
})