const poll = require("./utils/poll")

module.exports = 
{
    name: 'silenciar',
    description: '',
    execute(client, confing, message, args)
    {
        poll.createPoll(message.channel, message.mentions.members.first())
    }
}