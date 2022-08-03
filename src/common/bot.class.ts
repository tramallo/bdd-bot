import { Client, ClientOptions, Collection } from 'discord.js'
import readyBehaviour from '../behaviours/ready.behaviour'
import handleCommandsBehaviour from '../behaviours/handle-commands.behaviour'
import { Behaviour } from './behaviour.class'
import { BehaviourFactory, Command } from './types'

export type BotOptions = {
    useDefaultReadyBehaviour?: boolean
    useDefaultCommandHandlerBehaviour?: boolean
}

export class Bot extends Client<true> {
    public readonly configuration: BotOptions
    private readonly behaviours: Collection<string, Behaviour> = new Collection()
    private readonly commands: Collection<string, Command> = new Collection()
    // TODO: commands collection should be public?

    constructor(options: BotOptions & ClientOptions) {
        // TODO: read 'intents' page & configure the bot to use the needed ones only
        super(options)

        this.configuration = options
    }

    public getCommands(): Map<string, Command> {
        // TODO: investigate if it is secure to expose the map this way
        return this.commands
    }

    /** Instantiates the behaviour & adds it to the collection
     *
     * @param behaviourFactory. function that generates a behaviour (it receives the bot instance to interact with)
     */
    public async addBehaviour(behaviourFactory: BehaviourFactory): Promise<void> {
        const behaviour = await behaviourFactory(this)

        if (!behaviour.commands.length && !behaviour.onEvents.size && !behaviour.onceEvents.size) {
            console.warn(`Behaviour '${behaviour.name}' is empty`)
            return
        }

        this.behaviours.set(behaviour.name, behaviour)
    }

    private async registerEvents(behaviour: Behaviour): Promise<void> {
        console.info(`Registering events for '${behaviour.name}' behaviour`)

        if (behaviour.onceEvents.size) {
            console.info(`- Registering 'once' events`)
            for (const [eventName, eventFunc] of behaviour.onceEvents) {
                this.once(eventName, eventFunc as any)
                console.info(`-- registered once '${eventName}' event`)
            }
        }

        if (behaviour.onEvents.size) {
            console.info(`- Registering 'on' events`)
            for (const [eventName, eventFunc] of behaviour.onEvents) {
                this.on(eventName, eventFunc as any)
                console.info(`-- registered on '${eventName}' event`)
            }
        }

        if (behaviour.commands.length) {
            console.info(`- Instantiating commands`)
            for (const commandFactory of behaviour.commands) {
                const command = await commandFactory(this, behaviour)

                if (this.commands.some((alreadyRegistered: Command) => command.name == alreadyRegistered.name)) {
                    console.warn(`-- command '${command.name}' is already registered, skipping this one`)
                    continue
                }

                this.commands.set(command.name, command)
                console.info(`-- registered '${command.name}' command`)
            }
        }
    }

    private registerBehaviourEvents(): void {
        for (const [behaviourName, behaviour] of this.behaviours) {
            this.registerEvents(behaviour)
        }
    }

    private async init(): Promise<void> {
        const { useDefaultCommandHandlerBehaviour, useDefaultReadyBehaviour } = this.configuration

        if (useDefaultReadyBehaviour) {
            await this.addBehaviour(readyBehaviour)
        }

        if (useDefaultCommandHandlerBehaviour) {
            await this.addBehaviour(handleCommandsBehaviour)
        }

        this.registerBehaviourEvents()
    }

    // TODO: this should return void or the result of client.login() ???
    public async start(botToken: string): Promise<void> {
        if (!botToken) {
            throw new Error('A token must be specified to start the bot')
        }

        console.info(`Initial configuration`)
        await this.init()

        console.info(`Starting bot`)
        this.login(botToken)
    }
}
