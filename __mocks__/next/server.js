// Mock for next/server

export const NextResponse = {
  json(data, init) {
    return {
      status: init?.status || 200,
      json: async () => data,
      headers: new Map(Object.entries(init?.headers || {})),
    };
  },
};

export const NextRequest = class NextRequest {
  constructor(url, init) {
    this.url = url;
    this.method = init?.method || 'GET';
    this.body = init?.body;
    this.headers = new Map(Object.entries(init?.headers || {}));
  }

  async text() {
    return this.body || '';
  }

  async json() {
    return JSON.parse(this.body || '{}');
  }
};
