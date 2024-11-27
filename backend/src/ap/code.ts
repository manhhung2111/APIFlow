class Code extends Error {
  static ERROR = -1;
  static SUCCESS = 0;

  private code: number;
  private data?: object;

  constructor() {
    super("");
    this.code = Code.SUCCESS;
    this.message = "";
    this.data = {};
    this.name = "";
  }

  static success(name = "", message = "", data = {}) {
    const code = new Code();
    code.name = name;
    code.code = Code.SUCCESS;
    code.message = message;
    code.data = data;
    return code;
  }

  static error(name = "", message = "", data = {}) {
    const code = new Code();
    code.name = name;
    code.code = Code.ERROR;
    code.message = message;
    code.data = data;
    return code;
  }

  static unknownError(){
    const code = new Code();
    code.name = "UnknownError";
    code.code = Code.ERROR;
    code.message = "An unknown error occurred...";
    code.data = {};
    return code;
  }

  public good(): boolean {
    return this.code === Code.SUCCESS;
  }
}

export default Code;