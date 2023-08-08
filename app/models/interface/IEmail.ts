export interface IEmail {
    Send(email: String, token: string): Promise<void>
    redefinePassword(email: string, passToken: string): Promise<void>
}