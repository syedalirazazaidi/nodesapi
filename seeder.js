const fs = require("fs");
const mongoose=require('mongoose');
// const color=require('colors')
const dotenv=require('dotenv')
dotenv.config({path:'./config/config.env'})
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
     useUnifiedTopology: true 
  });
  const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
  const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
  const importData=async()=>{
      try{
          await Bootcamp.create(bootcamps)
        await Bootcamp.create(courses)
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