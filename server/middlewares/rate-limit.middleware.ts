import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { auth } from '../utils/auth.util';
import { API_COMMENT_POST_RATE_LIMIT, API_REQUEST_RATE_LIMIT } from '../config/index.config';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.originalUrl.includes('/api/comments') && req.method === 'POST' && !auth(req)) {
            return rateLimit({ windowMs: API_COMMENT_POST_RATE_LIMIT.windowMs, max: API_COMMENT_POST_RATE_LIMIT.max })(
                req,
                res,
                next
            );
        } else if (req.originalUrl.includes('/api')) {
            return rateLimit({
                windowMs: API_REQUEST_RATE_LIMIT.windowMs,
                max: API_REQUEST_RATE_LIMIT.max,
            })(req, res, next);
        }
    }
}
