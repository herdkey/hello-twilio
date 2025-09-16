type QueryPrimitive = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryPrimitive | QueryPrimitive[]>;

/**
 * Converts an object representing query parameters into a query string.
 *
 * @param {QueryParams} params - An object where keys represent the parameter names and values represent their respective values. Values can be strings, numbers, null, undefined, or arrays of such primitive types. Null or undefined values are ignored.
 * @return {string} A string starting with a "?" that represents the query parameters. If the input object is empty or only has null/undefined values, an empty string is returned.
 */
export function stringifyQuery(params: QueryParams): string {
  const sp = new URLSearchParams();

  for (const [key, value] of Object.entries(params || {})) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      for (const v of value) {
        if (v == null) continue;
        sp.append(key, String(v));
      }
    } else {
      sp.append(key, String(value));
    }
  }

  const s = sp.toString();
  return s ? `?${s}` : '';
}

export type Params = Record<string, string | number | undefined>;
export type WithParams = (params: Params) => string;

/**
 * Appends query parameters to the provided base path.
 *
 * @param {string} basePath - The base path to which the query parameters will be appended.
 * @return {WithParams} A function that takes an object of query parameters and returns the full URL with the parameters serialized.
 */
export function withParams(basePath: string): WithParams {
  return (params) => basePath + stringifyQuery(params);
}
