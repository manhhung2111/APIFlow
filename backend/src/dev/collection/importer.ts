import {ClientSession} from "mongoose";
import {DBCollection} from "@dev/collection/index";
import {Authorization} from "@services/authorization";
import {DBFolder} from "@dev/folder";
import {DBRequest} from "@dev/request";
import {RequestBody} from "@services/request";
import {DBExample} from "@dev/example";
import UUID from "@utils/uuid";
import Client from "@dev/client";
import {HTMLInput} from "@ap/core";
import HuggingFaceEmbeddingService from "@services/ai/hugging.face";
import logger from "@ap/utils/logger";

export default class DBCollectionImporter {
    private static user_id: string = "";
    public static async importCollection(user_id: string, data: any, session: ClientSession) {
        try {
            this.user_id = user_id;
            const collection = await DBCollection.initialize() as DBCollection;
            const collectionRelease = await this.readCollection(collection, data, session);

            const folders = data.item.filter((item: any) => !("request" in item));
            const requests = data.item.filter((item: any) => "request" in item);
            // Process items

            const [a, b, c] = await this.importFolders(folders, collection, session);
            const [d, e] = await this.importRequests(requests, collection, session);

            const foldersRelease = [...a];
            const requestsRelease = [...b, ...d];
            const examplesRelease = [...c, ...e];

            return {
                collection: collectionRelease,
                folders: foldersRelease,
                requests: requestsRelease,
                examples: examplesRelease,
            }
        } catch (error) {
            console.error(error);
            throw new Error((error as Error).message);
        }
    }

    private static async importFolders(dataFolders: any[], collection: DBCollection, session: ClientSession) {
        try {
            let folders: DBFolder[] = [];
            let requestsReleases = [];
            let examplesRelease = [];

            for (const data of dataFolders) {
                const folder = await DBFolder.initialize() as DBFolder;
                if (!folder || !folder.object || !collection.object) {
                    throw new Error("Something went wrong");
                }

                folder.object.user_id = this.user_id;
                folder.object.token = UUID.randomTokenSize32();
                folder.object.workspace_id = collection.object.workspace_id.toString();
                folder.object.collection_id = collection.object._id.toString();

                folder.object.name = data.name;
                folder.object.content = data.description;

                if (data.auth) {
                    if (data.auth?.type == "jwt") {
                        folder.object.authorization.type = Authorization.JWTBearerAuth;
                        folder.object.authorization.data.payload = data.auth.jwt.payload || "";
                        folder.object.authorization.data.secret = data.auth.jwt.secret || "";
                        folder.object.authorization.data.algorithm = data.auth.jwt.algorithm || "HS256";
                    } else if (data.auth?.type == "bearer") {
                        folder.object.authorization.type = Authorization.BearerTokenAuth;
                        folder.object.authorization.data.bearer_token = data.auth.bearer.token || "";
                    } else if (data.auth?.type == "basic") {
                        folder.object.authorization.type = Authorization.BasicAuth;
                        folder.object.authorization.data.password = data.auth.basic.password || "";
                        folder.object.authorization.data.username = data.auth.basic.username || "";
                    } else if (data.auth?.type == "noauth") {
                        folder.object.authorization.type = Authorization.NoAuth;
                    }
                }

                if (data.event && data.event.length > 0) {
                    folder.object.scripts.pre_request = data.event[0]?.script?.exec?.join("\n") || "";
                    folder.object.scripts.post_response = data.event[1]?.script?.exec?.join("\n") || "";
                }

                if (data.item && data.item.length > 0) {
                    const [requests, examples] = await this.importRequests(data.item, collection, session, folder);
                    requestsReleases.push(...requests);
                    examplesRelease.push(...examples);
                }

                folders.push(folder);
            }

            if (folders.length > 0) {
                const documents = folders.map(folder => folder.object!);
                await DBFolder.insertMany(documents, session);
                console.log(`✅ Inserted ${folders.length} folders in bulk.`);

                return [folders.map(folder => folder.releaseCompact()), requestsReleases, examplesRelease];
            }

            return [[], [], []];
        } catch (error) {
            logger.error((error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    private static async importRequests(dataRequests: any[], collection: DBCollection, session: ClientSession, folder: DBFolder | null = null) {
        try {
            let requests: DBRequest[] = [];
            let exampleReleases: any[] = [];

            for (const data of dataRequests) {
                const request = await DBRequest.initialize() as DBRequest;
                if (!request || !request.object || !collection.object) {
                    throw new Error("Something went wrong");
                }

                request.object.user_id = this.user_id;
                request.object.token = UUID.randomTokenSize32();
                request.object.workspace_id = collection.object.workspace_id.toString();
                request.object.collection_id = collection.object._id.toString();

                if (folder && folder.object) {
                    request.object.folder_id = folder.object._id.toString();
                } else {
                    request.object.folder_id = null;
                }

                request.object.name = data.name;

                if (data.event && data.event.length > 0) {
                    request.object.scripts.pre_request = data.event[0]?.script?.exec?.join("\n") || "";
                    request.object.scripts.post_response = data.event[1]?.script?.exec?.join("\n") || "";
                }

                if (data.request) {
                    request.object.method = data.request.method;
                    request.object.content = data.request.description;
                    try {
                        if (request.object.content && request.object.content.length > 0) {
                            request.object.embedding = await HuggingFaceEmbeddingService.embedText(data.request.description);
                        }
                    } catch (error) {
                        logger.error((error as Error).message);
                    }

                    if (data?.request?.auth) {
                        if (data.request.auth.type == "jwt") {
                            request.object.authorization.type = Authorization.JWTBearerAuth;
                            request.object.authorization.data.payload = data.request.auth.jwt.payload || "";
                            request.object.authorization.data.secret = data.request.auth.jwt.secret || "";
                            request.object.authorization.data.algorithm = data.request.auth.jwt.algorithm || "HS256";
                        } else if (data.request.auth?.type == "bearer") {
                            request.object.authorization.type = Authorization.BearerTokenAuth;
                            request.object.authorization.data.bearer_token = data.request.auth.bearer.token || "";
                        } else if (data.request.auth?.type == "basic") {
                            request.object.authorization.type = Authorization.BasicAuth;
                            request.object.authorization.data.password = data.request.auth.basic.password || "";
                            request.object.authorization.data.username = data.request.auth.basic.username || "";
                        } else if (data.request.auth?.type == "noauth") {
                            request.object.authorization.type = Authorization.NoAuth;
                        }
                    }

                    request.object.headers = data.request.header.map((header: any) => {
                        return {
                            selected: header.disabled == true ? false : true,
                            content: header.description || "",
                            key: header.key,
                            value: header.value,
                        }
                    })

                    if (data.request.body) {
                        if (data.request.body.mode == "formdata") {
                            request.object.body.type = RequestBody.FormData;
                            request.object.body.data.form_data = data.request.body.formdata.map((row: any) => {
                                return {
                                    selected: row.disabled == true ? false : true,
                                    content: row.description || "",
                                    key: row.key,
                                    value: row.value || row.src || "",
                                    type: row.type || "text",
                                }
                            })
                        } else if (data.request.body.mode == "urlencoded") {
                            request.object.body.type = RequestBody.FormEncoded;
                            request.object.body.data.form_encoded = data.request.body.urlencoded.map((row: any) => {
                                return {
                                    selected: row.disabled == true ? false : true,
                                    content: row.description || "",
                                    key: row.key,
                                    value: row.value || row.src || "",
                                }
                            })
                        } else if (data.request.body.mode == "raw") {
                            request.object.body.type = RequestBody.FormRaw;
                            request.object.body.data.form_raw = data.request.body.raw;
                        }
                    }

                    if (data.request.url) {
                        if (typeof data.request.url === "string") {
                            request.object.url = data.request.url;
                            request.object.params = [];
                        } else {
                            const urlObject = this.rebuildUrl(data.request.url);
                            request.object.url = urlObject?.url || "";
                            request.object.params = urlObject?.params || [];
                        }
                    }
                }

                if (data.response && data.response.length > 0) {
                    const examples = await this.importExamples(data.response, request, session);
                    exampleReleases.push(...examples);
                }

                requests.push(request);
            }

            if (requests && requests.length > 0) {
                const documents = requests.map(request => request.object!);
                await DBRequest.insertMany(documents, session);
                console.log(`✅ Inserted ${requests.length} requests in bulk.`);

                return [requests.map(request => request.releaseCompact()), exampleReleases];
            }

            return [[], []];
        } catch(error) {
            throw new Error((error as Error).message);
        }
    }

    private static async importExamples(dataExamples: any, request: DBRequest, session: ClientSession) {
        try {
            let examples: DBExample[] = [];
            for (const data of dataExamples) {
                const example = await DBExample.initialize() as DBExample;
                if (!example || !example.object || !request.object) {
                    throw new Error("Something went wrong");
                }

                example.object.token = UUID.randomTokenSize32();
                example.object.user_id = this.user_id;
                example.object.workspace_id = request.object.workspace_id.toString();
                example.object.collection_id = request.object.collection_id;
                example.object.folder_id = request.object.folder_id ?? null;
                example.object.request_id = request.object._id.toString();
                example.object.name = data.name;
                if (data.originalRequest) {
                    example.object.request = {};
                    example.object.request.method = data.originalRequest.method;

                    example.object.request.headers = data.originalRequest.header.map((header: any) => {
                        return {
                            selected: header.disabled == true ? false : true,
                            content: header.description || "",
                            key: header.key,
                            value: header.value,
                        }
                    })

                    if (data.originalRequest.body) {
                        example.object.request.body = {};
                        example.object.request.body.data = {};

                        if (data.originalRequest.body.mode == "formdata") {
                            example.object.request.body.type = RequestBody.FormData;
                            example.object.request.body.data.form_data = data.originalRequest.body.formdata.map((row: any) => {
                                return {
                                    selected: row.disabled == true ? false : true,
                                    content: row.description || "",
                                    key: row.key,
                                    value: row.value || row.src || "",
                                    type: row.type || "text",
                                }
                            })
                        } else if (data.originalRequest.body.mode == "urlencoded") {
                            example.object.request.body.type = RequestBody.FormEncoded;
                            example.object.request.body.data.form_encoded = data.originalRequest.body.urlencoded.map((row: any) => {
                                return {
                                    selected: row.disabled == true ? false : true,
                                    content: row.description || "",
                                    key: row.key,
                                    value: row.value || row.src || "",
                                }
                            })
                        } else if (data.originalRequest.body.mode == "raw") {
                            example.object.request.body.type = RequestBody.FormRaw;
                            example.object.request.body.data.form_raw = data.originalRequest.body.raw;
                        }
                    }

                    if (data.originalRequest.url) {
                        if (typeof data.originalRequest.url === "string") {
                            example.object.request.url = data.originalRequest.url;
                            example.object.request.params = [];
                        } else {
                            const urlObject = this.rebuildUrl(data.originalRequest.url);
                            example.object.request.url = urlObject?.url || "";
                            example.object.request.params = urlObject?.params || [];
                        }
                    }
                }

                let status = "";
                if (data.status && data.code) {
                    status = data.code + " " + data.status;
                }

                example.object.response = {
                    headers: data.header.reduce((acc: any, item: any) => {
                        acc[item.key] = item.value;
                        return acc;
                    }, {}),
                    body: data.body || "",
                    status: status
                }

                examples.push(example);
            }

            if (examples && examples.length > 0) {
                const documents = examples.map(example => example.object!);
                await DBExample.insertMany(documents, session);
                console.log(`✅ Inserted ${examples.length} examples in bulk.`);

                return examples.map(example => example.releaseCompact());
            }

            return [];
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    private static async readCollection(collection: DBCollection, data: any, session: ClientSession) {
        if (!collection || !collection.object) {
            throw new Error("Something went wrong");
        }

        collection.object.user_id = this.user_id;
        collection.object.token = UUID.randomTokenSize32();
        collection.object.workspace_id = HTMLInput.inputInline("workspace_id");

        collection.object.name = data.info.name;
        collection.object.content = data.info.description ?? "";

        // Authorization
        if (data.auth?.type == "jwt") {
            collection.object.authorization.type = Authorization.JWTBearerAuth;
            collection.object.authorization.data.payload = data.auth.jwt.payload || "";
            collection.object.authorization.data.secret = data.auth.jwt.secret || "";
            collection.object.authorization.data.algorithm = data.auth.jwt.algorithm || "HS256";
        } else if (data.auth?.type == "bearer") {
            collection.object.authorization.type = Authorization.BearerTokenAuth;
            collection.object.authorization.data.bearer_token = data.auth.bearer.token || "";
        } else if (data.auth?.type == "basic") {
            collection.object.authorization.type = Authorization.BasicAuth;
            collection.object.authorization.data.password = data.auth.basic.password || "";
            collection.object.authorization.data.username = data.auth.basic.username || "";
        } else {
            collection.object.authorization.type = Authorization.NoAuth;
        }

        collection.object.variables = data.variable?.map((variable: any) => {
            return {
                variable: variable.key,
                initial_value: variable.value,
                current_value: variable.value,
                selected: variable.disabled == true ? false : true,
            }
        }) ?? [];

        if (data.event && data.event.length > 0) {
            collection.object.scripts.pre_request = data.event[0]?.script?.exec?.join("\n") || "";
            collection.object.scripts.post_response = data.event[1]?.script?.exec?.join("\n") || "";
        }

        await collection.save(session);
        return collection.releaseCompact();
    }

    private static rebuildUrl(urlObject: any): { url: string, params: any[] } | undefined {
        try {
            let {protocol, host, path, query} = urlObject;

            // Handle missing protocol (assume "https" as default or omit if missing)
            let protocolString = protocol ? `${protocol}://` : "";

            // Handle missing host
            let hostString = Array.isArray(host) ? host.join(".") : host || "";

            // Reconstruct path (ensure leading slash if no host)
            let pathString = "";
            if (Array.isArray(path)) {
                pathString = path.map((segment) => segment.includes("{{") || segment.startsWith(":") ? segment : (segment)).join("/");
            } else {
                pathString = path || "";
            }

            if (!pathString.startsWith("/")) {
                pathString = "/" + pathString; // Ensure leading slash
            }

            // Reconstruct query parameters
            let queryString = query?.filter((param: any) => !param.disabled) // Exclude disabled params
                ?.map((param: any) => `${param.key}=${param.value}`)
                ?.join("&");

            // Build final URL
            let fullUrl = `${protocolString}${hostString}${pathString}`;

            // If both protocol & host are missing, remove leading slash to make it relative
            if (!protocol && !host && !pathString.includes("{{")) {
                fullUrl = pathString.substring(1); // Remove starting "/"
            }

            if (queryString) {
                fullUrl += `?${queryString}`;
            }

            let params = query?.map((row: any) => {
                return {
                    key: row.key,
                    value: row.value,
                    content: row.description || "",
                    selected: row.disabled == true ? false : true,
                }
            }) ?? [];

            return {
                url: fullUrl,
                params: params
            };
        } catch (error) {
            console.error((error as Error).message);
            throw new Error((error as Error).message);
        }
    }

}