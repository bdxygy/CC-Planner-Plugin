/**
 * NDJSON (Newline Delimited JSON) utilities
 * Uses the 'ndjson' package for streaming parse/serialize
 */
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
export declare function parseNdjson<T = unknown>(filePath: string): T[];
/**
 * Parse an NDJSON file with metadata extraction
 * First line with `metadata` key is extracted separately
 */
export declare function parseNdjsonWithMetadata<T = unknown>(filePath: string): {
    records: T[];
    metadata: Record<string, unknown> | null;
};
/**
 * Write records to an NDJSON file
 */
export declare function writeNdjson<T = unknown>(filePath: string, records: T[], metadata?: Record<string, unknown>): void;
/**
 * Stream read NDJSON file line by line
 */
export declare function readNdjsonStream<T = unknown>(filePath: string): AsyncGenerator<NdjsonLine<T>>;
/**
 * Create a parse stream using the ndjson package
 * Use with fs.createReadStream(filePath).pipe(parseStream)
 */
export declare function createParseStream(): NodeJS.ReadWriteStream;
/**
 * Create a stringify stream using the ndjson package
 * Use with stream.pipe(stringifyStream).pipe(fs.createWriteStream(filePath))
 */
export declare function createStringifyStream(): NodeJS.ReadWriteStream;
export { ndjson };
//# sourceMappingURL=index.d.ts.map