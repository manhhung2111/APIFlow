type QueryType =
    | { match: Record<string, any> }
    | { multi_match: Record<string, any> }
    | { term: Record<string, any> }
    | { terms: Record<string, any> }
    | { bool: Record<string, any> }
    | { range: Record<string, any> };

export default class ElasticsearchQueryBuilder {
    private queries: QueryType[] = [];
    private _index: string = "";
    private _size?: number;
    private _from?: number;

    public setIndex(index: string) {
        this._index = index;
        return this;
    }

    public setSize(size: number) {
        this._size = size;
        return this;
    }

    public setFrom(from: number) {
        this._from = from;
        return this;
    }

    public addMatch(field: string, value: string) {
        this.queries.push({ match: { [field]: value } });
        return this;
    }

    public addMultiMatch(query: string, fields: string[], options: Record<string, any> = {}) {
        this.queries.push({
            multi_match: {
                query: query,
                fields: fields,
                ...options,
            },
        });
        return this;
    }

    public addTerm(field: string, value: any) {
        this.queries.push({ term: { [field]: value } });
        return this;
    }

    public addTerms(field: string, value: any) {
        this.queries.push({ terms: { [field]: value } });
        return this;
    }

    public build() {
        const body: any = {
            query: {
                bool: {
                    must: this.queries,
                },
            },
        };

        if (this._size !== undefined) body.size = this._size;
        if (this._from !== undefined) body.from = this._from;

        return {
            index: this._index,
            body,
        };
    }
}

