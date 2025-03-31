import axios from "axios";
import * as process from "node:process";

export default class HuggingFaceEmbeddingService {
    public static async embedText(text: string) {
        try {
            const options = {
                method: "POST",
                url: "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`
                },
                data: {
                    inputs: text
                }
            }

            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}