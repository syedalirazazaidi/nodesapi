const fs = require("fs");
const mongoose=require('mongoose');
// const color=require('colors')
const dotenv=require('dotenv')
dotenv.config({path:'./config/config.env'})
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
     useUnifiedTopology: true 
  });
  const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
  const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
  const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))
  const importData=async()=>{
      try{
          await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
          console.log('Data Imported');
          process.emit()

      }catch(err){
   console.log("err",err)
      }
  }
  const deleteData=async()=>{
    try{
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log('Data destroyed');
        process.emit()

    }catch(err){
 console.log("err",err)
    }
}
if(process.argv[2]==='i'){
  importData()
}
else if(process.argv[2]==='d'){
    deleteData()
}