// Mock next/link
jest.mock("next/link", () => {
  return ({ children, ...props }) => <a {...props}>{children}</a>;
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/",
}));

// Mock lucide-react context
jest.mock("lucide-react", () => {
  const actual = jest.requireActual("lucide-react");
  return {
    ...actual,
    Icon: (props) => <svg {...props} />,
    Check: (props) => <svg {...props} />,
    X: (props) => <svg {...props} />,
    ArrowRight: (props) => <svg {...props} />,
  };
});
// Jest setup file for polyfills and global test configuration
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for jsdom environment
Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

// Polyfill Request and Response for API route tests
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(url, init) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.body = init?.body;
      this.headers = new Map((init?.headers instanceof Map ? [...init.headers] : Object.entries(init?.headers || {})));
    }
    
    async json() {
      return JSON.parse(this.body || '{}');
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map((init?.headers instanceof Map ? [...init.headers] : Object.entries(init?.headers || {})));
    }
    
    async json() {
      return JSON.parse(typeof this.body === 'string' ? this.body : JSON.stringify(this.body));
    }
  };
}

// Set up fetch for global scope
global.fetch = jest.fn();
