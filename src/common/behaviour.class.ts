import { BotEvent, Command, CommandFunction } from './types'
import { ChatInputApplicationCommandData, ClientEvents, IntentsString } from 'discord.js'
import { CommandAlreadyRegistered, IntentAlreadyRegistered } from './errors'

export const commandFunctions = new Map<string, CommandFunction>()

// TODO: the properties of this class are public ???
export class Behaviour {
    public readonly name: string
    public readonly commands = new Map<string, ChatInputApplicationCommandData>()
    public readonly intents: Array<IntentsString> = []
    public readonly events: Array<BotEvent<any>> = []

    constructor(name: string) {
        this.name = name
    }

    // TODO: using addCommand instead of adding directly must be enforced
    public addCommand = (command: Command) => {
        if (commandFunctions.has(command.name)) {
            throw new CommandAlreadyRegistered(`a command name with '${command.name}' is already registered`)
        }

        this.commands.set(command.name, command as ChatInputApplicationCommandData)
        commandFunctions.set(command.name, command.onCall)
    }

    public addEvent = <K extends keyof ClientEvents>(event: BotEvent<K>) => {
        this.events.push(event)
    }

    public addIntent = (intent: IntentsString) => {
        if (this.intents.includes(intent)) {
            throw new IntentAlreadyRegistered(`intent '${intent}' already registered`)
        }

        this.intents.push(intent)
    }
}
