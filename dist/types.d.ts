export interface ITorrent {
    date: string;
    download_uri: string;
    external_link: string;
    leechs: number;
    module_id: string;
    module_title: string;
    peers: number;
    seeds: number;
    size: string;
    title: string;
}
export interface ITask {
    id: string;
    size: number;
    status: string;
    title: string;
    type: string;
    username: string;
}
