const stores = new Map<String, Map<String, any>>

export const getOrCreate = <T>(storeName: string) => {

    if (stores.has(storeName)) {
        return stores.get(storeName)
    }

    const store = new Map<String, T>()

    stores.set(storeName, store)

    return store
}