const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');

//enable cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, EHAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


app.use(express.json());








app.listen(300, () => console.log("Listening on port 3000"));