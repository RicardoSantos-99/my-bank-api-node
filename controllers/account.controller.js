import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";

const {readFile, writeFile} = fs

async function createAccount(req, res, next) {
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
}

async function getAccounts(req, res, next) {
    try {
        const data = JSON.parse(await readFile(FILE_NAME))

        res.send(data)

    } catch (err) {
        next(err)
    }
}

async function getAccountById(req, res, next) {
    try {
        const {id} = req.params

        const data = JSON.parse(await readFile("accounts.json"))

        const account = data.accounts.find(account => account.id === id)

        res.send(account)

    } catch (err) {
        next(err)
    }
}

async function deleteAccount(req, res, next) {
    try {
        const {id} = req.params

        const data = JSON.parse(await readFile(FILE_NAME))

        data.accounts = data.accounts.filter(account => account.id !== id)

        await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

        res.end()

    } catch (err) {
        next(err)
    }
}

async function updateAccount(req, res, next) {
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
}

async function updateBalance(req, res, next) {
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
}

export default {
    createAccount,
    getAccounts,
    getAccountById,
    deleteAccount,
    updateAccount,
    updateBalance
}