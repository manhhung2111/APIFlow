export interface IUser {
    email: string,
    password: string,
    first_name?: string,
    last_name?: string,

    oauth_provider?: string,
    oauth_id?: string,
    remember_token?: string,

    data: object,

    created_at: number,
    updated_at: number,
}