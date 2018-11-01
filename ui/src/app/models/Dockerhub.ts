export interface DockerhubResponse {
    num_pages: number;
    num_results: number;
    page: number;
    page_size: number;
    query: string;
    results: DockerhubContainer[];
}

export interface DockerhubContainer {
    description: string;
    is_automated: boolean;
    is_official: boolean;
    is_trusted: boolean;
    name: string;
    star_count: number;
    tags?: string[];
    selectedTag?: string;
}
