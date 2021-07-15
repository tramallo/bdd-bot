const config = require('../../config.json');

module.exports = 
{
    name: 'poll',
    createPoll(channel, target)
    {
        const reactionFilter = (reaction, user) => { !user.bot && reaction === config.pollYes || reaction === config.pollNo}

        channel.send(`votacion perrona! ${target.user.username}`).then(sent => 
        {
            sent.react(config.pollYes);
            sent.react(config.pollNo);
            sent.awaitReactions( reactionFilter, { time: 15000 } ).then( collected => 
            {
                countReactions(sent)
            })
        })
    }
}

function countReactions(message)
{
    let yes = 0
    let no = 0

    const reactions = message.reactions.cache.filter( (reaction, user) => !user.bot && reaction === config.pollNo || reaction === config.pollYes )

    reactions.each( (id, reaction) => 
    {
        console.log(`looping...`)
        if(reaction.emoji === config.pollYes) yes ++
        if(reaction.emoji === config.pollNo) no ++
    })

    message.channel.send(`votacion terminada\nNo: ${no}\nYes:${yes}`);
}