import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import morgan from "morgan";
import {
    CollectionRoute,
    EnvironmentRoute,
    ExampleRoute,
    FolderRoute, PersonaRoute,
    RequestRoute,
    UserRoute,
    WorkspaceRoute,
} from "@routes";
import {Code, HTMLInput} from "@ap/core";
import logger from "@utils/logger";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT || 8080;
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

// Config CORS
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
}));

// Body form data
app.use(express.json());
app.use(express.urlencoded({extended: false, limit: "1mb"}));

// Cookies
app.use(cookieParser(process.env.COOKIES_SECRET));

// Read files
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 2 * 1024 * 1024}
});

app.use(upload.any(), (request, response, next) => {
    HTMLInput.readRequest(request);
    next();
});

// File size validation
app.use((error: any, request: any, response: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return response.status(400).json({message: "File size should not exceed 2MB."});
        }
    }
    return next(error);
});


// Logger HTTP request
app.use(morgan("dev", {stream: {write: (message) => logger.info(message.trim())}}));

// Routes
app.use("/users", UserRoute);
app.use("/workspaces", WorkspaceRoute);
app.use("/collections", CollectionRoute);
app.use("/folders", FolderRoute);
app.use("/requests", RequestRoute);
app.use("/environments", EnvironmentRoute);
app.use("/examples", ExampleRoute);
app.use("/personas", PersonaRoute);


(async function () {
    try {
        // Connect to database
        await mongoose.connect(
            `mongodb+srv://${db_username}:${db_password}@hongkong-1.x4eds.mongodb.net/${db_name}`,
        ).then(() => {
            logger.info(`Connect to database successfully.`);
        });

        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (error) {
        logger.error((error as Error).stack);
    }
})();