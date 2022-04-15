import { RequestHandler } from 'express';
export interface AuthJWT {
    id: string;
    iat: number;
    exp: number;
    isOwner: boolean;
    owner: string;
}
declare global {
    namespace Express {
        interface Request {
            userJWT?: AuthJWT;
        }
        interface Response {
            owner: string;
        }
    }
}
declare const authMiddleware: RequestHandler;
export default authMiddleware;
