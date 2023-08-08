import {IArticle} from '../interface/IArticle.js'

export interface IBankMethodArticle {
    getAll(): Promise<IArticle[]>
    getAllById(idUser: String): Promise<IArticle[]>
    findArticleByCategoryId(item: string): Promise<IArticle>
    getById(id: string): Promise<IArticle>
    create(title: string, body: string, idCategory: string, login: string): Promise<void>
    edit(id: String): Promise<IArticle>
    update(id: string, title: string, body: string, category: any): Promise<IArticle>
    pagination(pageString: string): Promise<{
        result: {
            page: number,
            next: boolean,
            articles: IArticle[]
        }
    }>
    delete(id: String): Promise<void>
}