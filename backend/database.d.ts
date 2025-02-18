import {Types} from 'mongoose';

export interface DUser {
    email: string,
    username: string,
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
    user_id: string,

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

export interface DRequest {
    user_id: string;

    workspace_id: string;
    collection_id: string;
    folder_id?: string | null;

    name: string;
    content?: string;

    method: string;
    url: string;

    params: Array<{
        selected?: boolean,
        key?: string;
        value?: string;
        content?: string;
    }>;
    headers: Array<{
        selected?: boolean,
        key?: string;
        value?: string;
        content?: string;
    }>;
    authorization: {
        type: number;
        data?: object;
    };
    body: {
        type: number;
        data?: object;
    };
    scripts: {
        pre_request?: string;
        post_response?: string;
    };

    examples: Array<object>
    tag?: number;

    data: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DRequestHistory {
    user_id: string;
    workspace_id: string;

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
    user_id: string;
    workspace_id: string;
    collection_id: string;

    name: string;
    content?: string;

    authorization?: {
        type: number;
        data?: object;
    };

    scripts?: {
        pre_request?: string;
        post_response?: string;
    };

    data?: object | {};
    token: string;

    created_at?: number;
    updated_at?: number;
}

export interface DEnvironment {
    user_id: string;
    workspace_id: string;

    name: string;

    scope: number;
    variables: Array<{
        selected: boolean,
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
    user_id: string;
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
    user_id: string;
    workspace_id: string;

    name: string;
    content?: string;

    authorization?: {
        type: number;
        data?: object;
    };

    scripts?: {
        pre_request?: string;
        post_response?: string;
    };

    variables: Array<{
        selected: boolean,
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

export interface DActivityLog {
    user_id:string;
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