import { BotEvent, CommandFactory } from './types'

export interface BehaviourData {
    name: string
    commands: Array<CommandFactory>
    events: Array<BotEvent<any>>
}

export class Behaviour {
    public readonly name: string
    public readonly commands: Array<CommandFactory>
    public readonly events: Array<BotEvent<any>>

    constructor(values: BehaviourData) {
        this.name = values.name
        this.commands = values.commands
        this.events = values.events
    }
}
