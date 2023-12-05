interface IParameters {
    baseUrl: string;
    path: string;
    api: string;
    version: string;
    method: string;
    options?: Record<string, string>;
}
export declare function buildUrl(parameters: IParameters): string;
export {};
