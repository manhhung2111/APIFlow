class Response {
  static ERROR = -1;
  static SUCCESS = 0;

  constructor() {
    this.code = Response.SUCCESS;
    this.message = "";
    this.data = "";
  }

  static success(message = "", data = "") {
    const response = new Response();
    response.code = Response.SUCCESS;
    response.message = message;
    response.data = data;
    return response;
  }

  static error(message = "", data = "") {
    const response = new Response();
    response.code = Response.ERROR;
    response.message = message;
    response.data = data;
    return response;
  }
}

export default Response;