import {Client} from "@elastic/elasticsearch";

export default class ElasticsearchClient {
    private static _client: Client;

    static {
        if (this._client == null) {
            this._client = new Client(
                {
                    node: "http://localhost:9200"
                }
            )
        }
    }

    public static async search(index: string, query: any) {
        return await this._client.search({index, body: query});
    }

    public static async existsIndex(index: string) {
        return await this._client.indices.exists({index});
    }

    public static async createIndex(index: string, body: any) {
        return await this._client.indices.create({index: index, body: body});
    }

    public static async indexDocument(index: string, id: string, document: any) {
        return await this._client.index({index, id, body: document});
    }

    public static async updateDocument(index: string, id: string, document: any) {
        return await this._client.update({index, id, body: document});
    }

    public static async deleteDocument(index: string, id: string) {
        return await this._client.delete({index, id});
    }

    public static async bulkDocument(operations: any) {
        const bulkResponse = await this._client.bulk({refresh: true, body: operations});

        if (bulkResponse.errors) {
            const erroredDocuments: any[] = []
            // The items array has the same order of the dataset we just indexed.
            // The presence of the `error` key indicates that the operation
            // that we did for the document has failed.
            bulkResponse.items.forEach((action: any, i) => {
                const operation = Object.keys(action)[0]
                if (action[operation].error) {
                    erroredDocuments.push({
                        // If the status is 429 it means that you can retry the document,
                        // otherwise it's very likely a mapping error, and you should
                        // fix the document before to try it again.
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: operations[i * 2],
                        document: operations[i * 2 + 1]
                    })
                }
            })
            console.log(erroredDocuments)

            return bulkResponse;
        }
    }
}