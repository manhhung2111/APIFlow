import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {
	CollectionRoute,
	EnvironmentRoute,
	ExampleRoute,
	FolderRoute,
	RequestRoute,
	UserRoute,
	WorkspaceRoute,
} from "@routes";
import {HTMLInput} from "@ap/core";
import logger from "@utils/logger";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT || 8080;
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

// Config CORS
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({
	origin: "http://localhost:5763",
	optionsSuccessStatus: 200,
}));

// Body form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookies
app.use(cookieParser(process.env.COOKIES_SECRET));

// Routes
app.use((request, response, next) => {
	HTMLInput.readRequest(request);
	next();
});

app.use(morgan("dev", {stream: {write: (message) => logger.info(message.trim())}}));

app.use("/users", UserRoute);
app.use("/workspaces", WorkspaceRoute);
app.use("/workspaces/:workspace_id/collections", CollectionRoute);
app.use("/workspaces/:workspace_id/folders", FolderRoute);
app.use("/workspaces/:workspace_id/requests", RequestRoute);
app.use("/workspaces/:workspace_id/examples", ExampleRoute);
app.use("/workspaces/:workspace_id/environments", EnvironmentRoute);


(async function (){
	try{
		// Connect to database

		await mongoose.connect(
			`mongodb+srv://${db_username}:${db_password}@hongkong-1.x4eds.mongodb.net/${db_name}`,
		).then(() => {
			logger.info(`Connect to database successfully.`);
		});

		app.listen(port, () => {
			logger.info(`Server is running on port ${port}`);
		});
	} catch (error){
		logger.error((error as Error).message);
	}
})();