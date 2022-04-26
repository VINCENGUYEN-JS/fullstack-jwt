import { JwtPayload } from "jsonwebtoken";

export type PayloadAuth = JwtPayload & { userId: number };
