import { AnyCampNotFound } from '../models/errors/AnyCampNotFound.js'
import { IValidation } from '../models/interface/iValidation.js'

export class Validation implements IValidation{
    public validationFields (fields: string[]): void {
        let notValue: string[] = [];
        fields.forEach(field => {
            if(typeof field !== 'string' || field.length === 0 || field === null || field === undefined) 
                notValue.push(field)
        })
        if (notValue.length > 0) throw new AnyCampNotFound(notValue.join(", "))
    }
}
