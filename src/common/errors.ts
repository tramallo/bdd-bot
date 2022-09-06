export class BehaviourAlreadyRegistered extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'BehaviourAlreadyRegisteredError'
    }
}

export class CommandAlreadyRegistered extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CommandAlreadyRegisteredError'
    }
}

export class IntentAlreadyRegistered extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'IntentAlreadyRegisteredError'
    }
}
