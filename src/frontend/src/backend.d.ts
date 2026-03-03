import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SectionSummary {
    id: bigint;
    title: string;
    description: string;
}
export interface SearchResult {
    id: bigint;
    title: string;
}
export interface Section {
    id: bigint;
    title: string;
    subsections: Array<Subsection>;
    description: string;
}
export interface Subsection {
    body: string;
    subtitle: string;
}
export interface backendInterface {
    getAllSections(): Promise<Array<SectionSummary>>;
    getSection(id: bigint): Promise<Section>;
    searchSections(searchQuery: string): Promise<Array<SearchResult>>;
}
