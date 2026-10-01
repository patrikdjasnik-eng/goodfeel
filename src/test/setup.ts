import { afterEach, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { cleanup } from '@testing-library/react';
import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';

vi.stubGlobal('crypto', webcrypto);

class MemoryStorage implements Storage {
  private readonly items = new Map<string, string>();

  get length(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.items.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  setItem(key: string, value: string): void {
    this.items.set(key, String(value));
  }
}

if (!globalThis.localStorage || !window.localStorage) {
  const memoryStorage = new MemoryStorage();

  vi.stubGlobal('localStorage', memoryStorage);
  vi.stubGlobal('sessionStorage', memoryStorage);
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});