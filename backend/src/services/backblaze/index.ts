import B2 from "backblaze-b2";
import BackBlazeB2 from "backblaze-b2";
import dotenv from "dotenv";
import * as process from "node:process";
import {Code} from "@ap/core";
import TimeUtils from "@utils/time";

dotenv.config();

export default class BackblazeService{
	private static _b2: BackBlazeB2;

	static{
		this._b2 = new B2({
			applicationKeyId: process.env.BACKBLAZE_B2_KEY_ID || "",
			applicationKey: process.env.BACKBLAZE_B2_APP_KEY || "",
		});
	}


	public static async uploadFile(file: Express.Multer.File){
		try{
			await this._b2.authorize();
			const response = await this._b2.getUploadUrl({bucketId: process.env.BACKBLAZE_B2_BUCKET_ID || ""});
			const {uploadUrl, authorizationToken} = response.data;

			const upload_result = await this._b2.uploadFile({
				uploadUrl: uploadUrl,
				uploadAuthToken: authorizationToken,
				fileName: TimeUtils.getCurrentDate() + "/" + file.originalname,
				mime: file.mimetype,
				data: file.buffer,
			});

			return {
				file_id: upload_result.data.fileId,
				file_name: upload_result.data.fileName,
				content_type: upload_result.data.contentType,
				content_length: upload_result.data.contentLength,
				uploaded_at: upload_result.data.uploadTimestamp,
			};
		} catch (error){
			throw new Code((error as Error).message);
		}
	}

	public static async getFileById(id: string){
		await this._b2.authorize();

		const file = await this._b2.getFileInfo({fileId: id});
		return file.data;
	}

	public static async downloadFileById(id: string){
		try{
			await this._b2.authorize();

			const file = await this._b2.downloadFileById({fileId: id, responseType: "document"});

			return file;
		} catch (error){
			throw new Code((error as Error).message);
		}

	}
}