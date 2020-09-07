'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;


const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(process.env.MONGODB, mongooseOptions, ()=>{
    app.listen(PORT, () => {
        console.log(`glistening on ${PORT}`)
    });
});
