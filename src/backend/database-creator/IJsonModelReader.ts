export interface IJsonModelReader<T> {
    getJsonModels: () => Promise<T[]>
}