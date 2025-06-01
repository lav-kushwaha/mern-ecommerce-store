require('dotenv').config();
const express = require("express");
const connectDB  = require("./config/database");
const jwt = require("jsonwebtoken");
const {authRouter} = require("./router/authRouter")

const app = express();

//read req.body from client or parse data into json to js.
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/",authRouter)


//connecting DB
connectDB()
.then(()=>{
        app.listen(PORT,()=>{
             console.log(`server is listening on : http://localhost:${PORT}`)
        })
        console.log("Db is connected");
}) 
.catch(err=>{
        console.log("Database is not connected",err); 
})
   