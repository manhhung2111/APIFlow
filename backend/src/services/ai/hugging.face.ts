import axios from "axios";
import * as process from "node:process";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

export default class HuggingFaceEmbeddingService {
    private static _model: HuggingFaceTransformersEmbeddings | null = null;

    static {
        if (this._model == null) {
            this._model = new HuggingFaceTransformersEmbeddings({
                model: "Xenova/all-MiniLM-L6-v2",
            });
        }
    }

    public static async embedText(text: string) {
        try {
            // const options = {
            //     method: "POST",
            //     url: "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
            //     headers: {
            //         Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`
            //     },
            //     data: {
            //         inputs: text
            //     }
            // }

            if (this._model == null) {
                throw new Error("Please initialize HuggingFaceEmbeddingService first!");
            }

            const response = await this._model.embedQuery(text);
            return response;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}