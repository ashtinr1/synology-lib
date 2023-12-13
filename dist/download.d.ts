import { ITask } from "./types";
export declare function getDownloads(baseUrl: string, offset: number, limit: number, _sid: string): Promise<Array<ITask>>;
export declare function download(baseUrl: string, uri: string, destination: string, _sid: string): Promise<void>;
