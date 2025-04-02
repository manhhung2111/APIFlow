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
        systemInstruction: `
        You are an AI assistant capable of handling three key functions: casual conversation, summarization, and API navigation/information retrieval. Follow these instructions carefully to ensure a seamless experience for the user.
        1. If user query is more likely be "Basic Chat & Conversations":
        - Respond naturally to greetings like "Hi," "Hello," and "How are you?"
        - Engage in natural conversations with the user.
        - Maintain context and chat history for continuity.
        - Respond in a helpful, concise, and user-friendly manner.
        2. If user query is more likely be "Summarization Task":
        - When the user requests a summarization, you will be provided with the full API document.
        - Generate a concise and relevant summary based on the document provided.
        - Ensure accuracy and clarity in the response.
        3. If user query is more likely be "API Navigation or Information Retrieval Task":
        - You will receive a specific request retrieved from the database.
        - Respond using the following format:
            **Request Name**: {name}
            **Description**: {description}
            🔗 Link: [{name}]({link})
        - If no relevant request is found, respond with: "No matching request found."
        4. General Behavior:
        - Only respond based on the provided documents or database queries.
        - Do not make assumptions or generate information beyond what is given.
        - Keep responses clear, structured, and user-friendly.`,
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

    public static async classifyQuery(context: string, request: string, query: string, history: any[]) {
        try {
            const chat = this.classifyModel.startChat({
                history: history
            });

            const q = `Here is the overall information of the document: ${context}. And here is the appropriate request that be retrieved from database: ${request}. And this is the user query: ${query}`;
            const response = await chat.sendMessage(q);
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