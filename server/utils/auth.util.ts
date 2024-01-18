import jwt from 'jsonwebtoken';
import { TOKEN_SECRET_KEY } from '../config/index.config';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const auth = (req: Request) => {
    // eslint-disable-next-line no-prototype-builtins
    if (req.headers.hasOwnProperty('authorization')) {
        try {
            return jwt.verify((req.headers as any).authorization, TOKEN_SECRET_KEY);
        } catch (err) {
            throw new UnauthorizedException('Not logged in', err.message);
        }
    }
    return null;
};
