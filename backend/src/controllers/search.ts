import {Code, HTMLInput} from "@ap/core";
import ElasticsearchQueryBuilder from "@services/elasticsearch/query.builder";
import {DBWorkspaceLoader} from "@dev/workspace";
import ElasticsearchClient from "@services/elasticsearch/client";
import {Request, Response} from "express";
import {DBRequestFTS} from "@dev/request";

export default class SearchController {

    static async search(request: Request, response: Response) {
        try {
            const query = HTMLInput.inputInline("query");

            const result = await DBRequestFTS.search(query);

            response.status(200).json(Code.success("Search successfully!", {result: result}));
        } catch (error) {
            response.status(500).json(Code.error((error as Error).message));
        }
    }
}