import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import {CollectionRoute, EnvironmentRoute, FolderRoute, RequestRoute, UserRoute, WorkspaceRoute} from "@routes";
import {HTMLInput} from "@ap/core";

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

// Routes
app.use(HTMLInput.readRequest);
app.use("/users", UserRoute);
app.use("/requests", RequestRoute);
app.use("/workspaces", WorkspaceRoute);
app.use("/collections", CollectionRoute);
app.use("/folders", FolderRoute);
app.use("/environments", EnvironmentRoute);


(async function (){
	try{
		// Connect to database

		await mongoose.connect(
			`mongodb+srv://${db_username}:${db_password}@hongkong-1.x4eds.mongodb.net/${db_name}`,
		).then(() => {
			console.info(`Connect to database successfully.`);
		});

		app.listen(port, () => {
			console.info(`Server is running on port ${port}`);
		});
	} catch (error){
		// @ts-ignore
		console.error(error.message);
	}
})();