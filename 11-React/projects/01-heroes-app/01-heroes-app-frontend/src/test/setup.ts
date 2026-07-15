// Node.js 26 breaks jsdom's localStorage — provide a full in-memory mock.
const makeStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem:    (key: string) => store[key] ?? null,
    setItem:    (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear:      () => { store = {}; },
    get length()  { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
};

const localStorageMock  = makeStorage();
const sessionStorageMock = makeStorage();

Object.defineProperty(global, 'localStorage',   { value: localStorageMock,   writable: true, configurable: true });
Object.defineProperty(global, 'sessionStorage', { value: sessionStorageMock, writable: true, configurable: true });
