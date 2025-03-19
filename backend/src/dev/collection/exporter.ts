import {DBComp} from "@ap/db";
import {DCollection} from "@db-schemas";
import {HydratedDocument} from "mongoose";
import {DBFolderLoader} from "@dev/folder";
import {DBRequestLoader} from "@dev/request";
import {DBExampleLoader} from "@dev/example";
import {Authorization} from "@services/authorization";
import {RequestBody} from "@services/request";

export default class DBCollectionExporter extends DBComp<DCollection> {

    constructor(obj: HydratedDocument<DCollection> | null | undefined) {
        super(obj);
    }

    async exportPostman() {
        if (!this._obj) return {};

        let folders = (await DBFolderLoader.byCollection(this._obj)).map(folder => folder.release());
        let requests = (await DBRequestLoader.byCollection(this._obj)).map(request => request.release());
        let examples = (await DBExampleLoader.byCollection(this._obj)).map(example => example.release());

        const [rootRequests, rootFolders] = this.constructTree(folders, requests, examples);

        // return {
        //
        // }
        const folderItems = rootFolders.map(folder => {
            return this.buildFolder(folder);
        });

        const requestItems = rootRequests.map(request => {
            return this.buildRequest(request);
        })

        const auth = this.getAuthorization(this._obj.authorization.type, this._obj.authorization.data, false);
        return {
            "info": {
                "name": this._obj.name,
                "description": this._obj.content,
                "schema": "https://schema.getpostman.com/json/collection/v2.0.0/collection.json",
            },
            "item": [...folderItems, ...requestItems],
            ...(auth !== null && {"auth": auth}),
            "event": this.getScripts(this._obj.scripts),
            "variable": this.getVariables()
        }
    }

    private buildFolder(folder: any) {
        const auth = this.getAuthorization(folder.authorization.type, folder.authorization.data, true);

        return {
            "name": folder.name,
            "description": folder.content,
            ...(auth !== null && {"auth": auth}),
            "event": this.getScripts(folder.scripts),
            "item": folder.children.map((request: any) => {
                return this.buildRequest(request);
            }),
        }
    }

    private buildRequest(request: any) {
        const requestAuth = this.getAuthorization(request.authorization.type, request.authorization.data, true);

        return {
            "name": request.name,
            "description": request.content,
            "event": this.getScripts(request.scripts),
            "request": {
                ...(requestAuth !== null && {"auth": requestAuth}),
                "method": request.method,
                "header": RequestUtils.buildHeaders(request.headers),
                "body": RequestUtils.buildBody(request.body),
                "url": RequestUtils.buildUrl(request.url, request.params),
            },
            "response": request.children.map((example: any) => {
                return RequestUtils.buildResponse(example);
            })
        }
    }

    private getAuthorization(auth_type: number, auth_data: any, can_inherit = true) {
        if (!this._obj) return null;

        if (auth_type == Authorization.JWTBearerAuth) {
            return {
                "type": "jwt",
                "jwt": {
                    "payload": auth_data.payload,
                    "secret": auth_data.secret,
                    "algorithm": auth_data.algorithm,
                    "isSecretBase64Encoded": false,
                    "addTokenTo": "header",
                    "headerPrefix": "Bearer",
                    "queryParamKey": "token",
                    "header": "{}"
                }
            }
        } else if (auth_type == Authorization.BearerTokenAuth) {
            return {
                "type": "bearer",
                "bearer": {
                    "token": auth_data.bearer_token
                }
            }
        } else if (auth_type == Authorization.BasicAuth) {
            return {
                "type": "basic",
                "basic": {
                    "password": auth_data.password,
                    "username": auth_data.username,
                }
            }
        } else if (auth_type == Authorization.NoAuth && can_inherit) {
            return {
                "type": "noauth"
            }
        }

        return null;
    }

    private getVariables() {
        if (!this._obj) return [];
        return this._obj.variables.map((variable) => {
            return {
                "key": variable.variable,
                "value": variable.initial_value,
                "disabled": variable.selected ? false : true
            }
        });
    }

    private getScripts(scripts: any) {
        const prerequest = scripts.pre_request.split("\n") ?? [""];
        const postresponse = scripts.post_response.split("\n") ?? [""];

        return [
            {
                "listen": "prerequest",
                "script": {
                    "type": "text/javascript",
                    "package": {},
                    "exec": prerequest
                }
            },
            {
                "listen": "test",
                "script": {
                    "type": "text/javascript",
                    "package": {},
                    "exec": postresponse
                }
            }
        ]
    }

    private constructTree(folders: any, requests: any, examples: any) {
        const foldersMap = new Map(folders.map((folder: any) => [folder._id.toString(), {...folder, children: []}]));
        const requestsMap = new Map(requests.map((request: any) => [request._id.toString(), {
            ...request,
            children: []
        }]));

        examples.forEach((example: any) => {
            if (requestsMap.has(example.request_id)) {
                // @ts-ignore
                requestsMap.get(example.request_id).children.push(example);
            }
        });

        const rootRequests: any[] = [];
        requests.forEach((request: any) => {
            if (request.folder_id && foldersMap.has(request.folder_id)) {
                console.log("in");
                // @ts-ignore
                foldersMap.get(request.folder_id).children.push(requestsMap.get(request._id.toString()));
            } else {
                rootRequests.push(requestsMap.get(request._id.toString()));
            }
        });

        return [rootRequests, Array.from(foldersMap.values())];
    }
}

class RequestUtils {
    static buildBody(body: any) {
        if (body.type == RequestBody.FormData) {
            return {
                "mode": "formdata",
                "formdata": body.data.form_data.map((row: any) => {
                    let result: any = {};
                    result["key"] = row.key;
                    result["description"] = row.description;
                    result["type"] = row.type;
                    result["disabled"] = row.selected ? false : true;

                    if (row.type == "text") {
                        result["value"] = row.value;
                    } else {
                        result["src"] = "";
                    }

                    return result;
                })
            }
        } else if (body.type == RequestBody.FormEncoded) {
            return {
                "mode": "urlencoded",
                "urlencoded": body.data.form_encoded.map((row: any) => {
                    return {
                        "key": row.key,
                        "value": row.value,
                        "description": row.content,
                        "type": row.type || "text",
                        "disabled": row.selected ? false : true
                    };
                })
            }
        } else if (body.type == RequestBody.FormRaw) {
            return {
                "mode": "raw",
                "raw": body.data.form_raw,
                "options": {
                    "raw": {
                        "language": "json"
                    }
                }
            }
        }

        return null;
    }

    static buildUrl(url: string, params: any) {
        function parsePostmanURL(urlString: string) {
            let protocol = null;
            let host = null;
            let pathArray: any[] = [];

            // Extract protocol
            let protocolMatch = urlString.match(/^(https?):\/\//);
            if (protocolMatch) {
                protocol = protocolMatch[1];
                urlString = urlString.replace(protocolMatch[0], ''); // Remove protocol from URL
            }

            // Separate query params
            let [urlWithoutQuery, queryString] = urlString.split('?');

            // Extract host & path
            let urlParts = urlWithoutQuery.split('/').filter(part => part.length > 0);
            if (urlParts.length > 0) {
                host = urlParts.shift(); // First part is the host
                pathArray = urlParts; // Remaining parts are the path
            }

            return {
                ...(protocol != null && {"protocol": protocol}),
                ...(host != null && {host: host?.includes('{{') ? [host] : host?.split('.'),}), // Split host
                path: pathArray,
            };
        }

        let query = params.map((row: any) => {
            return {
                "key": row.key,
                "value": row.value,
                "description": row.content,
                "disabled": row.selected ? false : true,
            }
        })

        return {
            "raw": url,
            ...parsePostmanURL(url),
            "query": query
        }
    }

    static buildHeaders(headers: any) {
        return headers.map((row: any) => {
            return {
                "key": row.key,
                "value": row.value,
                "description": row.content,
                "disabled": row.selected ? false : true,
            }
        })
    }

    static buildResponse(example: any) {
        let [code, ...statusArray] = example.response.status.split(" ");
        code = parseInt(code, 10);
        const status = statusArray.join(" ");

        return {
            "name": example.name,
            "originalRequest": {
                "method": example.request.method,
                "header": this.buildHeaders(example.request.headers),
                "body": this.buildBody(example.request.body),
                "url": this.buildUrl(example.request.url, example.request.params),
            },
            ...(status.length > 0 && {"status": status}),
            ...(!Number.isNaN(code) && {"code": code}),
            "header": Object.entries(example.response.headers).map(([key, value]) => ({key, value})),
            "cookie": [],
            "body": example.response.body
        }
    }
}