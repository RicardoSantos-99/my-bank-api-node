import { promises as fs } from "fs"
import express from "express";
import winston from 'winston';
import accountsRouter from "./routes/account.routes.js";
import cors from "cors";

const {readFile, writeFile} = fs
const {combine, timestamp, label, printf} = winston.format

const logFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`
})

global.FILE_NAME = "accounts.json";
global.LOGGER = winston.createLogger({
    level: 'silly',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: "my-bank-api.log"}),
    ],
    format: combine(
        label({ label: "my-bank-api"}),
        timestamp(),
        logFormat
    )
});

const app = express()
app.use(express.json());
app.use(cors());
app.use("/account", accountsRouter)

app.listen(3000, async () => {
    try {
        await readFile(FILE_NAME);
        LOGGER.info("API ON")
    } catch (e) {
        const initialJson = {
            accounts: []
        }

        writeFile(FILE_NAME, JSON.stringify(initialJson)).then(() => {
            LOGGER.info("Api Started and file created");
        }).catch(err => {
            LOGGER.error(err);
        })
    }

})

//
// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
// };