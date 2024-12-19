type ResponseModelParams = {
  statusCode?: number;
  data?: string | object;
  error?: string;
  message?: string;
};

export default class ResponseModel {
  statusCode: number;
  data?: string | object;
  error?: string;
  message?: string;
  success: boolean;
  items: number;

  constructor({ statusCode = 404, data, error, message }: ResponseModelParams) {
    this.success = false;
    this.statusCode = statusCode;

    if (statusCode >= 200 && statusCode <= 299) this.success = true;

    this.error = error;
    this.message = message;

    if (data) {
      if (Array.isArray(data)) {
        this.items = data.length;
      } else {
        this.items = 1;
      }
    } else {
      this.items = 0;
    }

    this.data = data;
  }
}
