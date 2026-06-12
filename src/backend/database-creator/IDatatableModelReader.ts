import { DatatableModel } from "../types";

export interface IDatatableModelReader {
    getDatatableModels: () => Promise<DatatableModel[]>
}