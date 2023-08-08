import { Document, Types } from 'mongoose';
import { IUser } from './IUser';

export interface IArticle extends Document {
    title: string;
    slug: string;
    body: string;
    categoryId: string;
    idUser: Types.ObjectId | string | IUser;
}