import { ClientEvents } from 'discord.js'
import { Bot } from './bot.class'
import { Command, CommandFactory } from './types'

// TODO: onEvents & onceEvents typing is ugly
export class Behaviour {
    public readonly name: string
    public readonly commands: Array<CommandFactory> = []
    public readonly onEvents: Map<string, unknown> = new Map()
    public readonly onceEvents: Map<string, unknown> = new Map()

    constructor(name: string) {
        this.name = name
    }

    public addCommand(command: (bot: Bot) => Promise<Command>) {
        this.commands.push(command as CommandFactory)
    }

    public onEvent<K extends keyof ClientEvents>(eventName: K, eventFunction: (...args: ClientEvents[K]) => Promise<void>) {
        this.onEvents.set(eventName, eventFunction)
    }

    public onceEvent<K extends keyof ClientEvents>(eventName: K, eventFunction: (...args: ClientEvents[K]) => Promise<void>) {
        this.onceEvents.set(eventName, eventFunction)
    }
}
