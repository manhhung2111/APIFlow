export interface DUser {
    email: string,
    password: string,
    name?: string,

    google_id?: string,
    github_id?: string,
    remember_token?: string,

    data: object | {},

    created_at: number,
    updated_at: number,
}

export interface DWorkspace {
    user_id: string,

    name: string,
    content: string,

    viewers: Array<string>,
    commenters: Array<string>,
    editors: Array<string>,

    data: object | {},
    token: string,

    created_at: number,
    updated_at: number,
}

export interface DRequest {
    user_id: string;

    workspace_id: string;
    collection_id: string;
    folder_id?: string | null;

    name: string;
    content: string;

    method: string;
    url: string;

    params: Array<{
        selected: boolean,
        key: string;
        value: string;
        content: string;
    }>;
    headers: Array<{
        selected: boolean,
        key: string;
        value: string;
        content: string;
    }>;
    authorization: {
        type: number;
        data: any;
    };
    body: {
        type: number;
        data: any;
    };
    scripts: {
        pre_request: string;
        post_response: string;
    };

    tag?: number;

    data: object | {};
    token: string;

    created_at: number;
    updated_at: number;
}

export interface DFolder {
    user_id: string;
    workspace_id: string;
    collection_id: string;

    name: string;
    content: string;

    authorization: {
        type: number;
        data: any;
    };

    scripts: {
        pre_request: string;
        post_response: string;
    };

    data: object | {};
    token: string;

    created_at: number;
    updated_at: number;
}

export interface DEnvironment {
    user_id: string;
    workspace_id: string;

    name: string;

    scope: number;
    variables: Array<{
        selected: boolean,
        variable: string;
        type: "text" | "password";
        initial_value: string;
        current_value: string;
    }>;

    data: object | {};
    token: string;

    created_at: number;
    updated_at: number;
}

export interface DCollection {
    user_id: string;
    workspace_id: string;

    name: string;
    content?: string;

    authorization: {
        type: number;
        data: any;
    };

    scripts: {
        pre_request: string;
        post_response: string;
    };

    variables: Array<{
        selected: boolean,
        variable: string;
        initial_value: string;
        current_value: string;
    }>;

    data?: object | {};
    token: string;

    created_at: number;
    updated_at: number;
}

export interface DExample {
    user_id: string;

    name: string;

    request: any;
    response: any;

    request_id: string;
    folder_id?: string | null;
    collection_id: string;
    workspace_id: string;

    data: object | {};

    token: string;
    created_at: number;
    updated_at: number;
}

export interface DPersona {
    user_id: string,
    workspace_id: string,

    name: string,
    authorization: {
        type: number;
        data: any;
    }

    data: object | {};
    token: string;

    created_at: number;
    updated_at: number;
}