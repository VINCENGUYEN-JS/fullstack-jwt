import { Request, Response } from "express";
import { PayloadAuth } from "./PayloadAuth";

export type Context = {
  req: Request;
  res: Response;
  user: PayloadAuth;
};
