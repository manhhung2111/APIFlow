class Code extends Error {
  static ERROR = -1;
  static SUCCESS = 0;

  static UNKNOWN_ERROR = "Unknown error...";
  private code: number;
  private _data: object;

  constructor(message: string) {
    super(message);
    this.code = Code.ERROR;
    this._data = {};
  }

  static success(message = "", data = {}) {
    const code = new Code(message);
    code.code = Code.SUCCESS;
    code._data = data;
    return code;
  }

  static error(message = "", data = {}) {
    const code = new Code(message);
    code.code = Code.ERROR;
    code._data = data;
    return code;
  }

  public good(): boolean {
    return this.code === Code.SUCCESS;
  }

  public data(): object {
    return this._data;
  }
}

export default Code;