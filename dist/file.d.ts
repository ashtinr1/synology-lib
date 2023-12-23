export declare function getFilesFromDirectory(baseUrl: string, folder_path: string, offset: number, limit: number, _sid: string): Promise<{
    isdir: boolean;
    name: string;
    path: string;
}[]>;
