class MetaResponse {
  total: number;
  page: number;
  limit: number;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

export class ResponseData<T> {
  data: T | T[];
  meta: MetaResponse;

  constructor(data: T | T[], meta: MetaResponse) {
    this.data = data;
    this.meta = meta;
  }
}
