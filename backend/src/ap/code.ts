class Code {
  static ERROR = -1;
  static SUCCESS = 0;

  private code: number;
  private message?: string;
  private data?: object;

  constructor() {
    this.code = Code.SUCCESS;
    this.message = "";
    this.data = {};
  }

  static success(message = "", data = {}) {
    const code = new Code();
    code.code = Code.SUCCESS;
    code.message = message;
    code.data = data;
    return code;
  }

  static error(message = "", data = {}) {
    const code = new Code();
    code.code = Code.ERROR;
    code.message = message;
    code.data = data;
    return code;
  }
}

export default Code;