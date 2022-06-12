export class EnvVarNotDefinedError extends Error {
    constructor(message: string) {
        super()
        this.name = 'EnvVarNotDefinedError'
        this.message = message
    }
}
