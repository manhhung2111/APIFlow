import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import user_router from './routes/user';
require("dotenv").config();

const app = express()
const port = process.env.SERVER_PORT || 8080;
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const corsOptions = {
    origin: "http://localhost:5763",
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/users", user_router);


(async function () {
    try {
        //connect to database
        await mongoose.connect(
            `mongodb+srv://${db_username}:${db_password}@hongkong-1.x4eds.mongodb.net/${db_name}`,
        ).then(data => {
            console.log(`Connect to database successfully.`);
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
})();