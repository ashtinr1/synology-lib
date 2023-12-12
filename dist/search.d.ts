import { ITorrent } from "./types";
export declare function searchByKeyword(baseUrl: string, keyword: string, offset: number, limit: number, _sid: string): Promise<Array<ITorrent>>;
