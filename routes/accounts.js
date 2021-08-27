import express from "express";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

const {readFile, writeFile} = fs

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        let {name, balance} = req.body

        if (!name || balance === undefined) {
            throw new Error(`name and balance is required`)
        }

        const data = JSON.parse(await readFile(FILE_NAME));

        const account = {
            id: uuidv4(),
            name,
            balance
        }

        data.accounts.push(account);

        await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

        res.send(data)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})


router.get("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(FILE_NAME))

        res.send(data)

    } catch (err) {
        next(err)
    }

})

router.get("/:id", async (req, res, next) => {
    try {
        const {id} = req.params

        const data = JSON.parse(await readFile("accounts.json"))

        const account = data.accounts.find(account => account.id === id)

        res.send(account)

    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params

        const data = JSON.parse(await readFile(FILE_NAME))

        data.accounts = data.accounts.filter(account => account.id !== id)

        await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

        res.end()

    } catch (err) {
        next(err)
    }
})

router.put("/", async (req, res, next) => {
    try {
        const {id, name, balance} = req.body

        if (!id || !name || balance === undefined) {
            throw new Error(`id, name and balance is required`)
        }

        const data = JSON.parse(await readFile(FILE_NAME))
        const index = data.accounts.findIndex(accounts => accounts.id === id)

        if (index === -1) {
            throw new Error("user not found")
        }

        data.accounts[index] = {
            id,
            name,
            balance
        }

        await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

        res.send(data.accounts[index])

    } catch (err) {
        next(err)
    }
})

router.patch("/updateBalance", async (req, res, next) => {
    try {
        const {id, balance} = req.body

        if (!id || balance === undefined) {
            throw new Error(`id and balance is required`)
        }

        const data = JSON.parse(await readFile(FILE_NAME))
        const index = data.accounts.findIndex(accounts => accounts.id === id)

        if (index === -1) {
            throw new Error("user not found")
        }

        data.accounts[index].balance = balance

        await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

        res.send(data.accounts[index])

    } catch (err) {
        next(err)
    }
})

router.use((err, req, {status}, next) => {
    const {baseUrl, method} = req;
    const {message} = err;
    LOGGER.error(`${method} ${baseUrl} - ${message}`);
    status(400).send({error: message})
})


export default router;