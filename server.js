const express = require("express")
const app = express();
const morgan = require("morgan")
require("dotenv").config()

const port = process.env.PORT || 4000;
app.use(morgan("tiny"))

//parse json bodies............... 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./server/routes/router'));



app.use((req, res) => {
    res.status(404).json({message:"Page not found"})
})

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})