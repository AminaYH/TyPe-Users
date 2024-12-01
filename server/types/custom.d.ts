import { SessionData } from 'express-session';

export interface ISession extends SessionData {
    userSecret: string;
    username: string;
}
