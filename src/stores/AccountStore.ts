import { makeAutoObservable } from "mobx";

export type AppTheme = 'light' | 'dark'

enum StorageKey {
    userAddress = 'userAddress',
    isSubscribed = 'isSubscribed'
}

export class AccountStore {
    constructor() {
        makeAutoObservable(this)
        this.init()
    }

    public userAddress: string = '0x690b9a9e9aa1c9db991c7721a92d351db4fac990' // mocked address, same for every user
    public isSubscribed: boolean = false

    init () {
        const userAddress = this.getStorageKey(StorageKey.userAddress)
        if (userAddress) {
            this.setAddress(userAddress)
        }
        const isSubscribed = this.getStorageKey(StorageKey.isSubscribed)
        if(isSubscribed === 'true') {
            this.setIsSubscribed(!!isSubscribed, false)
        }
    }

    public setAddress (address: string) {
        this.userAddress = address
    }

    public setIsSubscribed (isSubscribed: boolean, updateStorage = true) {
        this.isSubscribed = isSubscribed
        this.setStorageKey(StorageKey.isSubscribed, String(isSubscribed))
    }

    private setStorageKey (key: StorageKey, value: string) {
        window.localStorage.setItem(key, value)
    }

    private getStorageKey (key: StorageKey) {
        return window.localStorage.getItem(key)
    }
}
