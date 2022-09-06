import { BotEvent, Command, CommandFunction } from './types'
import { CommandAlreadyRegistered } from './errors/commandAlreadyRegistered.error'
import { ChatInputApplicationCommandData, ClientEvents } from 'discord.js'

export const commandFunctions = new Map<string, CommandFunction>()

// TODO: the properties of this class are public ???
export class Behaviour {
    public readonly name: string
    public readonly commands = new Map<string, ChatInputApplicationCommandData>()
    public events: Array<BotEvent<any>> = []

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
}
