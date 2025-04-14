import type { ParsedLibrary } from "./types";

export class LibCache {
  private static instance: LibCache;
  private cache: Map<string, ParsedLibrary> = new Map();

  private constructor() {}

  static getInstance(): LibCache {
    if (!this.instance) {
      this.instance = new LibCache();
    }
    return this.instance;
  }

  getParsedLibrary(name: string): ParsedLibrary | undefined {
    return this.cache.get(name);
  }

  setParsedLibrary(name: string, library: ParsedLibrary) {
    this.cache.set(name, library);
  }

  clearCache(): void {
    this.cache.clear();
  }

  hasLib(name: string): boolean {
    return this.cache.has(name);
  }

  getLibs(): ParsedLibrary[] {
    return Array.from(this.cache.values());
  }
}
