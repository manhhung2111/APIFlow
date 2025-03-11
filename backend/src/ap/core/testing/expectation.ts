export default class ScriptsExpectation {
    private _actual: any;

    constructor(actual: any) {
        this._actual = actual;
    }

    private throwError(message: string): never {
        throw new Error(message);
    }

    public to = {
        be: {
            oneOf: (array: any[]) => {
                if (!array.includes(this._actual)) {
                    this.throwError(`Expected value to be one of ${JSON.stringify(array)} but got "${this._actual}"`);
                }
            }
        },
        eql: (value: any) => {
            if (this._actual !== value) {
                this.throwError(`Expected value to be "${value}" but got "${this._actual}"`);
            }
        },
        include: (searchString: string) => {
            if (typeof this._actual === 'string' && !this._actual.includes(searchString)) {
                this.throwError(`Expected value to include "${searchString}" but it does not`);
            }
        }
    };
}