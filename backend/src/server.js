import express from "express";
import mongoose from "mongoose";
require("dotenv").config();

const app = express()
const port = process.env.SERVER_PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})