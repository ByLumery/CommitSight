import path from "path";
import { config } from "dotenv";

const nodeEnv = process.env.NODE_ENV || "test";
const envFile = nodeEnv === "test" ? ".env.test" : ".env";
config({ path: path.resolve(process.cwd(), envFile) });
