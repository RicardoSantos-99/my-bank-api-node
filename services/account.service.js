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

export default {
    createAccount,
    getAccount,
    getAccountById,
}