import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
export declare const validate: (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=validate.middleware.d.ts.map