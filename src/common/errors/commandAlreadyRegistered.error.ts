export class CommandAlreadyRegistered extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CommandAlreadyRegisteredError'
    }
}
