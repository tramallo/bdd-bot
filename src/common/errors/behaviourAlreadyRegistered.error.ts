export class BehaviourAlreadyRegistered extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BehaviourAlreadyRegisteredError'
    }
}
