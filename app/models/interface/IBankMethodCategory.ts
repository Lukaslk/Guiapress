import {ICategory} from '../interface/ICategory.js'

export interface IBankMethodCategory {
    find(): Promise<ICategory>
    findOne(arg0: { item: any; }): Promise<ICategory>
    getAll(): Promise<ICategory[]>
    create(title: string): Promise<void>
    edit(id: string): Promise<ICategory> 
    update(id: string, title: string): Promise<ICategory>
    delete(id: string): Promise<void>
}