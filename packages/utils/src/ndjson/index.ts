/**
 * NDJSON (Newline Delimited JSON) utilities
 * Uses the 'ndjson' package for streaming parse/serialize
 */

import * as fs from 'fs';
import * as path from 'path';
import ndjson from 'ndjson';

export interface NdjsonLine<T = unknown> {
  line: string;
  index: number;
  data: T | null;
  error?: Error;
}

/**
 * Parse an NDJSON file into an array of records
 */
export function parseNdjson<T = unknown>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const records: T[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line) as T);
    } catch {
      // Skip invalid lines
    }
  }

  return records;
}

/**
 * Parse an NDJSON file with metadata extraction
 * First line with `metadata` key is extracted separately
 */
export function parseNdjsonWithMetadata<T = unknown>(
  filePath: string
): { records: T[]; metadata: Record<string, unknown> | null } {
  if (!fs.existsSync(filePath)) {
    return { records: [], metadata: null };
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const records: T[] = [];
  let metadata: Record<string, unknown> | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.metadata) {
        metadata = parsed.metadata;
      } else {
        records.push(parsed as T);
      }
    } catch {
      // Skip invalid lines
    }
  }

  return { records, metadata };
}

/**
 * Write records to an NDJSON file
 */
export function writeNdjson<T = unknown>(
  filePath: string,
  records: T[],
  metadata?: Record<string, unknown>
): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const lines: string[] = [];
  if (metadata) {
    lines.push(JSON.stringify({ metadata }));
  }
  for (const record of records) {
    lines.push(JSON.stringify(record));
  }
  fs.writeFileSync(filePath, lines.join('\n') + '\n');
}

/**
 * Stream read NDJSON file line by line
 */
export async function* readNdjsonStream<T = unknown>(
  filePath: string
): AsyncGenerator<NdjsonLine<T>> {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line.trim()) continue;

    try {
      yield {
        line,
        index: i,
        data: JSON.parse(line) as T,
      };
    } catch (error) {
      yield {
        line,
        index: i,
        data: null,
        error: error as Error,
      };
    }
  }
}

/**
 * Create a parse stream using the ndjson package
 * Use with fs.createReadStream(filePath).pipe(parseStream)
 */
export function createParseStream() {
  return ndjson.parse() as unknown as NodeJS.ReadWriteStream;
}

/**
 * Create a stringify stream using the ndjson package
 * Use with stream.pipe(stringifyStream).pipe(fs.createWriteStream(filePath))
 */
export function createStringifyStream() {
  return ndjson.stringify() as unknown as NodeJS.ReadWriteStream;
}

// Re-export the ndjson package for advanced use cases
export { ndjson };
