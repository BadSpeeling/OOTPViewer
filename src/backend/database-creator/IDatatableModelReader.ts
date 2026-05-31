import { DatatableModel } from "../types";

export interface IDatatableModelReader {
    getDatatableModels: () => DatatableModel[]
}