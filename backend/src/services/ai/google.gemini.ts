import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from "@google/generative-ai";
import * as process from "node:process";

export default class GoogleGeminiService {
    private static genAI = new GoogleGenerativeAI(process.env.GEMINI_PUBLIC_KEY || "")
    private static classifyModel = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
        ],
        systemInstruction: `You are an API query classifier. Your task is to analyze user queries and classify them into one of the following three categories:  
            1. **Summarize** → If the user requests an overview or summary of an API collection, including its folders and requests, return "Summarize".  
            2. **Retrieve a request** → If the user asks for details about a specific API request, such as its endpoint, parameters, or response structure, return "Retrieve a request".  
            3. **Non-relevant** → If the user's query is unrelated to API navigation, summaries, or request retrieval, return "Non-relevant".  
        Respond with only one of these three classifications as a single word or phrase, with no additional explanation.`,
    });


    private static summarizeModel = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
        ],
        systemInstruction: "You have access to the structure of an API collection, including its folders and requests. Your task is to generate a concise, high-level summary of the collection.\n" +
            "\n" +
            "Summarize the Collection’s Purpose: Provide a brief description of what the API collection is designed for.\n" +
            "\n" +
            "Describe Its Scope: Explain the general types of operations it supports (e.g., user management, payments, data retrieval).\n" +
            "\n" +
            "Do Not List Individual Folders or Requests: Instead of enumerating folders or requests, summarize their overall function.\n" +
            "\n" +
            "Ensure Clarity and Brevity: The summary should be easy to understand and provide just enough context" +
            " for further exploration.\""
    });

    private static retrievalModel = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            },
        ],
        systemInstruction: `You are an API request retriever. When given a query, use the provided request object to return the following structured response:
            **Request Name:** {name}  
            **Description:** {description}  
            🔗**Link:** [{name}]({link})  

            If no relevant request is found, respond with:  
            *"No matching request found."*`
    });

    public static async classifyQuery(query: string, history: any[]) {
        try {
            const chat = this.classifyModel.startChat({
                history: history
            });

            const response = await chat.sendMessage(query);
            return response.response.text();
        } catch (error) {
            console.error(error);
            throw new Error((error as Error).message);
        }
    }

    public static async summarize(context: string, query: string, history: any[]) {
        try {
            const chat = this.summarizeModel.startChat({
                history: history
            });

            const q = `Here is the user query: ${query}, and here is the document: ${context}`;
            const response = await chat.sendMessage(q);
            return response.response.text();
        } catch (error) {
            console.error(error);
            throw new Error((error as Error).message);
        }


    }

    public static async retrieve(context: string, query: string, history: any[]) {
        try {
            const chat = this.retrievalModel.startChat({
                history: history
            });

            const q = `Here is the user query: ${query}, and here is the request found by system: ${context}`;
            const response = await chat.sendMessage(q);
            return response.response.text();
        } catch (error) {
            console.error(error);
            throw new Error((error as Error).message);
        }
    }
}