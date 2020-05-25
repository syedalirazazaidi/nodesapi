const express=require("express")
const dotenv = require("dotenv")
const bootcamps = require('./routes/bootcamps')
const morgan=require('morgan')
dotenv.config({path:"./config/config.env"})
const app=express()
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
app.use('/api/v1/bootcamps',bootcamps)


const PORT=process.env.PORT||5005
app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} node on port ${PORT}` ))