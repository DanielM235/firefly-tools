/**
 * Deno type declarations for this project
 * This file provides type definitions for Deno global APIs
 */

declare global {
  const Deno: {
    readTextFile(path: string): Promise<string>;
    writeTextFile(path: string, data: string): Promise<void>;
    stat(path: string): Promise<Deno.FileInfo>;
    env: {
      get(key: string): string | undefined;
      set(key: string, value: string): void;
      delete(key: string): void;
    };
    exit(code?: number): never;
    Command: {
      new(command: string, options?: { args?: string[] }): {
        output(): Promise<{ success: boolean; stdout: Uint8Array; stderr: Uint8Array }>;
      };
    };
  };

  interface ImportMeta {
    main: boolean;
  }

  namespace Deno {
    interface FileInfo {
      isFile: boolean;
      isDirectory: boolean;
      isSymlink: boolean;
      size: number;
      mtime: Date | null;
      atime: Date | null;
      birthtime: Date | null;
      dev: number;
      ino: number | null;
      mode: number | null;
      nlink: number | null;
      uid: number | null;
      gid: number | null;
      rdev: number | null;
      blksize: number | null;
      blocks: number | null;
    }
  }
}

export {};
