import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from "redis";

dotenv.config();

connectDb();

export let redisClient: any = null;

if (process.env.DISABLE_REDIS === "true") {
    console.log("Redis disabled by environment");
} else {
    if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL is missing");
    }

    redisClient = createClient({
        url: process.env.REDIS_URL,
    });

    redisClient
        .connect()
        .then(() => console.log("Connected to redis"))
        .catch(console.error);
}

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})