import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

const {readFile, writeFile} = fs

async function writeAccount(account) {
    const data = {
        accounts: [...account]
    }

    await writeFile(FILE_NAME, JSON.stringify(data, null, 2))
}

async function getAccounts() {
    const data = JSON.parse(await readFile(FILE_NAME));

    return data.accounts
}

async function getAccountById(id) {
    const accounts = await getAccounts()

    return accounts.find(account => account.id === id)
}

async function insertAccount(name, balance) {
    const accounts = await getAccounts()

    const account = {
        id: uuidv4(),
        name,
        balance
    }

    accounts.push(account);

    await writeAccount(accounts);

    return account
}

async function removeAccount(id) {
    const accounts = await getAccounts()

    const newAccounts = accounts.filter(account => account.id !== id)

    await writeAccount(newAccounts)
}

async function updateAccount(id, name, balance) {
    const accounts = await getAccounts()
    const index = accounts.findIndex(account => account.id === id)

    if (index === -1) {
        throw new Error("user not found")
    }

    accounts[index] = {
        id,
        name,
        balance
    }

    await writeAccount(accounts)

    return accounts[index]
}

async function updateBalance(id, balance) {
    const accounts = await getAccounts()
    const index = accounts.findIndex(accounts => accounts.id === id)

    if (index === -1) {
        throw new Error("user not found")
    }

    accounts[index].balance = balance

    await writeAccount(accounts)

    return accounts[index]
}

export default {
    getAccounts,
    insertAccount,
    getAccountById,
    removeAccount,
    updateAccount,
    updateBalance
}