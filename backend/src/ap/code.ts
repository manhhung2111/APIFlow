export default class Code extends Error {
  static ERROR = -1;
  static SUCCESS = 0;

  static UNKNOWN_ERROR = "Unknown error...";
  private code: number;
  private data: object;

  constructor(message: string) {
    super(message);
    this.code = Code.ERROR;
    this.data = {};
  }

  static success(message = "", data = {}) {
    const code = new Code(message);
    code.code = Code.SUCCESS;
    code.data = data;
    return code;
  }

  static error(message = "", data = {}) {
    const code = new Code(message);
    code.code = Code.ERROR;
    code.data = data;
    return code;
  }

  public good(): boolean {
    return this.code === Code.SUCCESS;
  }

  toJSON() {
    return {
      code: this.code,
      data: this.data,
      message: this.message,
    };
  }
}
