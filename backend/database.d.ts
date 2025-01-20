import {Types} from 'mongoose';

export interface DUser {
    email: string,
    password: string,
    first_name?: string,
    last_name?: string,

    oauth_provider?: string,
    oauth_id?: string,
    remember_token?: string,

    data?: object | {},

    created_at?: number,
    updated_at?: number,
}

export interface DWorkspace {
    user_id: Types.ObjectId,

    name: string,
    content?: string,

    viewers: Array<string>,
    commenters: Array<string>,
    editors: Array<string>,

    data?: object | {},
    token: string,

    created_at?: number,
    updated_at?: number,
}

export interface DWorkspaceFollowing {
    user_id: Types.ObjectId,
    creator_id: Types.ObjectId,
    object_id: Types.ObjectId,

    name: string,
    content?: string,

    viewing?: 0 | 1,
    commenting?: 0 | 1,
    editing?: 0 | 1,

    viewers: Array<string>,
    commenters: Array<string>,
    editors: Array<string>,

    data?: object | {},
    token: string,

    created_at?: number,
    updated_at?: number,
}

export interface DRequest {
    user_id: Types.ObjectId;

    workspace_id: Types.ObjectId;
    collection_id: Types.ObjectId;
    folder_id?: Types.ObjectId | null;

    name: string;
    content?: string;

    method: string;
    url: string;

    params?: Array<{
        selected?: boolean,
        key?: string;
        value?: string;
        description?: string;
    }>;
    headers?: Array<{
        selected?: boolean,
        key?: string;
        value?: string;
        description?: string;
    }>;
    authorization?: {
        authorization_type: number;
        authorization_data?: object;
    };
    body?: {
        body_type: number;
        body_data?: object;
    };
    scripts?: {
        pre_script?: string;
        post_script?: string;
    };

    tag?: number;

    data?: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DRequestHistory {
    user_id: Types.ObjectId;
    workspace_id: Types.ObjectId;

    request: object;
    response: {
        headers: object;
        body: object;
        status_code?: number;
        response_time?: number;
        size?: number;
    };

    data?: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DFolder {
    user_id: Types.ObjectId;
    workspace_id: Types.ObjectId;
    collection_id: Types.ObjectId;

    name: string;
    content?: string;

    data?: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DEnvironment {
    user_id: Types.ObjectId;
    workspace_id: Types.ObjectId;

    name: string;

    scope: number;
    variables?: Array<{
        variable?: string;
        type?: "text" | "password";
        initial_value?: string;
        current_value?: string;
    }>;

    data?: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DComment {
    user_id: Types.ObjectId;
    meta_type?: string;

    obj_key: string;
    obj_export: object;

    title?: string;
    content?: string;
    followers?: string[];
    status?: number;

    data?: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DCollection {
    user_id: Types.ObjectId;
    workspace_id: Types.ObjectId;

    name: string;
    content?: string;

    data?: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DActivityLog {
    user_id: Types.ObjectId;
    meta_type?: string;

    name?: string;
    action?: string;
    tag?: string;

    obj_key: string;
    obj_type: string;
    obj_export: object;

    data?: object | {};

    created_at?: number;
    updated_at?: number;
}

export interface DExample {
    user_id: Types.ObjectId;

    name: string,

    request: object;
    response: object;

    request_id: Types.ObjectId;
    folder_id: Types.ObjectId | null;
    collection_id: Types.ObjectId;
    workspace_id: Types.ObjectId;

    data?: object | {};

    token: string;
    created_at?: number;
    updated_at?: number;
}