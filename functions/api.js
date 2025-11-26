import app from "../src/app";
import { handle } from "hono/node";

export const onRequest = handle(app);
