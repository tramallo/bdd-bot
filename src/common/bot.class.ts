import { Client, ClientOptions, Collection, Interaction } from 'discord.js'
import { Behaviour } from './behaviour.class'
import { commandFunctions } from './behaviour.class'
import { BehaviourAlreadyRegistered } from './errors/behaviourAlreadyRegistered.error'

export class Bot extends Client<true> {
    private readonly behaviours: Collection<string, Behaviour> = new Collection()

    constructor(options: ClientOptions) {
        // TODO: read 'intents' page & configure the bot to use the needed ones only
        super(options)
    }

    /** Add the behaviour to the collection
     *
     * @param behaviour. behaviour to be added to the collection
     */
    public async addBehaviour(behaviour: Behaviour): Promise<void> {
        if (!behaviour.commands.size && !behaviour.events.length) {
            console.warn(`behaviour '${behaviour.name}' is empty`)
            return
        }

        if (this.behaviours.has(behaviour.name)) {
            throw new BehaviourAlreadyRegistered(`behaviour '${behaviour.name}' is already registered`)
        }

        this.behaviours.set(behaviour.name, behaviour)
    }

    private async registerBehavioursEvents() {
        for (const [behaviourName, behaviour] of this.behaviours) {
            if (behaviour.events.length) {
                for (const event of behaviour.events) {
                    this[event.type](event.name, event.onCall)
                    console.info(`- '${behaviourName}' behaviour: ${event.type} '${event.name}' event registered`)
                }
            }
        }
    }

    private async setupCommandHandler() {
        // execute command function when command is called
        this.on('interactionCreate', async (interaction: Interaction) => {
            if (!interaction.isCommand()) {
                return
            }

            const commandFunction = commandFunctions.get(interaction.commandName)

            if (!commandFunction) {
                throw new Error(`command '${interaction.commandName}' not found`)
            }

            try {
                // TODO: improve the logging on this file (ex: execution timestamp? options? guild? caller?)
                console.info(`executing '${interaction.commandName}' command`)
                await commandFunction(interaction)
            } catch (error) {
                console.error(`unhandled error when executing '${interaction.commandName}' command`)
                throw error as Error
            }
        })
    }

    private async registerBehavioursCommands() {
        this.once('ready', async (client: Client) => {
            if (!client.user || !client.application) {
                throw new Error('user or application not found.')
            }

            console.info(`registering commands`)

            for (const [behaviourName, behaviour] of this.behaviours) {
                for (const [commandName, command] of behaviour.commands) {
                    // TODO: awaiting one by one ???
                    await this.application.commands.create(command)
                    console.log(`- '${behaviourName}' behaviour: ${commandName} command registered`)
                }
            }

            // TODO: think an intuitive way to stablish to which gilds set the commands (meanwhile a configurable one should be enough)
            //this.application.commands.set(list, process.env.TEST_GUILD_ID as string)
            //console.info(`command list registered to guild '${process.env.TEST_GUILD_ID}'`)
        })
    }

    private async init(): Promise<void> {
        await this.registerBehavioursCommands()

        await this.setupCommandHandler()

        await this.registerBehavioursEvents()
    }

    // TODO: this should return void or the result of client.login() ???
    public async start(botToken: string): Promise<void> {
        if (!botToken) {
            throw new Error('a token must be specified to start the bot')
        }

        console.info(`initial configuration`)
        await this.init()

        console.info(`starting bot`)
        this.login(botToken)
    }
}
