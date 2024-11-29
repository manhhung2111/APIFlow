export default interface IUser {
    email: string,
    password: string,
    first_name?: string,
    last_name?: string,

    oauth_provider?: string,
    oauth_id?: string,
    remember_token?: string,
}