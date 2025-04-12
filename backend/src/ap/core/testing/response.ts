export default class ScriptsResponse {
    private _body: any;
    public code: number | null;
    private _status: string | null;
    private _headers: Record<string, string> | null;

    constructor(response: any) {
        this._body = response.data ?? null;
        this.code = response.status ?? null;
        this._status = response.statusText ?? null;
        this._headers = response.headers ?? null;
    }

    public json() {
        try {
            return { ...this._body };
        } catch (error) {
            return {};
        }
    }

    public text() {
        try {
            return JSON.stringify(this._body);
        } catch (error) {
            return "";
        }
    }

    private throwError(message: string): never {
        throw new Error(message);
    }

    public to = {
        have: {
            status: (status: number | string) => {
                if (typeof status === "number") {
                    if (this.code !== status) {
                        this.throwError(`Expected response to have status code ${status} but got ${this.code}`);
                    }
                } else {
                    if (this._status !== status) {
                        this.throwError(`Expected response to have status reason '${status}' but got '${this._status}'`);
                    }
                }
            },
            body: (body: any) => {
                if (JSON.stringify(this._body) !== JSON.stringify(body)) {
                    this.throwError(`Expected body to be '${JSON.stringify(body)}' but got '${JSON.stringify(this._body)}'`);
                }
            },
            header: (key: string) => {
                if (!this._headers || !(key.toLowerCase() in this._headers)) {
                    this.throwError(`Expected response to have header with key '${key}'`);
                }
            },
        },
    };
}
