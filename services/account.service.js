import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";

const {readFile, writeFile} = fs

async function createAccount(name, balance) {
    const data = JSON.parse(await readFile(FILE_NAME));

    const account = {
        id: uuidv4(),
        name,
        balance
    }

    data.accounts.push(account);

    await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

    return account;

}

async function getAccount() {
    return JSON.parse(await readFile(FILE_NAME))
}

async function getAccountById(id) {
    const data = JSON.parse(await readFile("accounts.json"))

    return data.accounts.find(account => account.id === id)
}

async function deleteAccount(id) {
    const data = JSON.parse(await readFile(FILE_NAME))

    data.accounts = data.accounts.filter(account => account.id !== id)

    await writeFile(FILE_NAME, JSON.stringify(data, null, 2))
}

async function updateAccount(id, name, balance) {
    const data = await JSON.parse(await readFile(FILE_NAME))
    const index = data.accounts.findIndex(account => account.id === id)

    if (index === -1) {
        throw new Error("user not found")
    }

    data.accounts[index] = {
        id,
        name,
        balance
    }

    await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

    return data.accounts[index]
}

async function updateBalance(id, balance) {
    const data = JSON.parse(await readFile(FILE_NAME))
    const index = data.accounts.findIndex(accounts => accounts.id === id)

    if (index === -1) {
        throw new Error("user not found")
    }

    data.accounts[index].balance = balance

    await writeFile(FILE_NAME, JSON.stringify(data, null, 2))

    return data.accounts[index]
}

export default {
    createAccount,
    getAccount,
    getAccountById,
    deleteAccount,
    updateAccount,
    updateBalance
}