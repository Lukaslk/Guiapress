import { IArticle } from "./IArticle"

export interface IValidation {
    validationFields (fields: string[]): void
}