import { Client } from 'discord.js'
import commands from '../commands'

export default (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) {
            return
        }

        // TODO: handle error when aplication.commands permission is not grant.

        // TODO: register commands for more than just 1 guild.
        await client.application.commands.set(commands, '863492307071533065')

        console.log(`${client.user.username} is online`)
    })
}
