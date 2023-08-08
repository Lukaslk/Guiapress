import { IUser } from "./IUser";

export interface IBankMethodUser {
    insert(email: string, password: string): Promise<IUser>
    verify(reqToken: String): Promise<IUser>
    verifyRefreshToken(email: String): Promise<IUser>
    verifyAuthenticate(email: String, password: String): Promise<string>
    processReset(email: String): Promise<IUser>
    processVerifyReset(verifyReset: String): Promise<IUser>
    processVerifyPassword(email: String, pass: String): Promise<IUser>
    
};