import {DBWorkspaceLoader} from "@dev/workspace";
import ElasticsearchQueryBuilder from "@services/elasticsearch/query.builder";
import ElasticsearchClient from "@services/elasticsearch/client";

export default class RequestFTS {
    private static _ELASTICSEARCH_INDEX = "apiflow.requests";
    private static _INDEX_MAPPINGS = {
        mappings: {
            properties: {
                workspace_id: {type: 'keyword'},
                user_id: {type: 'keyword'},
                name: {type: 'text'},
                content: {type: 'text'},
                created_at: {type: 'date'},
                updated_at: {type: 'date'},
                method: {type: 'keyword'},
                url: {type: 'text'},
            }
        }
    }

    static {
        (async () => {
            if (!(await ElasticsearchClient.existsIndex(this._ELASTICSEARCH_INDEX))) {
                await ElasticsearchClient.createIndex(this._ELASTICSEARCH_INDEX, this._INDEX_MAPPINGS);
            }
        })();
    }

    public static async indexDocument(document: any) {
        await ElasticsearchClient.indexDocument(this._ELASTICSEARCH_INDEX, document._id, document);
    }

    public static async deleteDocument(document: any) {
        await ElasticsearchClient.deleteDocument(this._ELASTICSEARCH_INDEX, document._id);
    }

    public static async updateDocument(document: any) {
        await ElasticsearchClient.updateDocument(this._ELASTICSEARCH_INDEX, document._id, document);
    }

    public static async bulkIndexDocuments(documents: any[]) {

        const operations = documents.flatMap(doc => {
            const {_id, ...source} = doc;

            return [{index: {_index: this._ELASTICSEARCH_INDEX, _id: _id}}, source]
        });
        await ElasticsearchClient.bulkDocument(operations);
    }

    public static async search(query: string) {
        const accessibleWorkspaces = await DBWorkspaceLoader.mine();
        const workspaces = accessibleWorkspaces.map(w => w.release()._id);

        const searchQuery = new ElasticsearchQueryBuilder().setIndex(this._ELASTICSEARCH_INDEX)
            .addTerms("workspace_id", workspaces)
            .addMultiMatch(query, ["name", "content"])
            .setSize(5).build();

        const result = await ElasticsearchClient.search(searchQuery.index, searchQuery.body);

        return result;
    }
}