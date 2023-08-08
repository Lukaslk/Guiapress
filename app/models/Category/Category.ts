import "reflect-metadata"
import { ICategory } from '../interface/ICategory.js'
import {CategoryNotFound} from '../errors/CategoryNotFound.js'
import {IdNotFound} from '../errors/IdNotFound.js'
import slugify from 'slugify'
import * as mongoose from 'mongoose';
import { IBankMethodCategory } from '../interface/IBankMethodCategory.js'

const { model, Schema } = mongoose;

const Category = model('Category', new Schema<ICategory>({
    title: {
        type: String,
        allowNull: false
    },
    slug: {
        type: String,
        allowNull: false
    }
}))

class BankMethodCategory implements IBankMethodCategory  {
    public async find(): Promise<ICategory> {
        return await Category.find()
    }
    
    public async findOne(arg0: { item: any; }): Promise<ICategory> {
        return await Category.findOne(arg0)
    }

    public async getAll(): Promise<ICategory[]> {
        const categories: ICategory[] = await Category.find()
        if (!categories) throw new CategoryNotFound()
        return categories
    }

    public async create(title: string): Promise<void> {
        let category: ICategory = new Category({
            title: title,
            slug: slugify(title)
        })
        await category.save()
    }

    public async edit(id: string): Promise<ICategory> {
        const category: ICategory = await Category.findOne({ _id: id})
        if(!category) throw new CategoryNotFound()
        return category
    }

    public async update(id: string, title: string): Promise<ICategory> {
        const found: ICategory = await Category.findByIdAndUpdate(id, {title: title, slug: slugify(title)})
        if(!found) throw new IdNotFound()
        return found
    }

    public async delete(idCategory: string): Promise<void> {
        const found: ICategory = await Category.findByIdAndDelete({ _id: idCategory })
        if(!found) throw new IdNotFound()
    }
}

export {BankMethodCategory};