import dotenv from "dotenv";
dotenv.config();

import Bot from './Client';
import ready from './events/ready';

// Process related Events
process.on('uncaughtException', async exception => Bot.log.error('node error', exception));
process.on('unhandledRejection', async exception => Bot.log.error('node error', exception));

// Bot-User related Events
Bot.on('warn', (warn) => Bot.log.warn(warn));
Bot.on('shardError', (error) => Bot.log.error('mutIwa error', error));
Bot.on('shardDisconnect', (event) => Bot.log.debug("mutIwa disconnected", { event: event }));
Bot.on('shardReconnecting', (event) => Bot.log.debug("mutIwa reconnecting", { event: event }));
Bot.on('shardResume', async () => await ready());
Bot.once('shardReady', async () => {
    await ready();
    Bot.log.debug(`logged in as ${Bot.user.username}`);

    await Bot.guilds.fetch();
    let guilds = Bot.guilds.cache;

    for (const guild of guilds) {
        await Bot.muteInGuild(guild[1]);
    }
    Bot.log.info('perms updated everywhere');
});

Bot.on('guildCreate', async (guild) => {
    await Bot.muteInGuild(guild);
});

Bot.on('channelCreate', async (channel) => {
    if (channel.isThread()) return;
    if (channel.isVoice()) return;

    let iwa = await Bot.fetchIwa();

    if (channel.name.startsWith('ticket') || channel.id === '897900124452290580') {
        await channel.permissionOverwrites.edit(iwa, { SEND_MESSAGES: null, SEND_MESSAGES_IN_THREADS: null })
            .catch(err => Bot.log.error(`error while changing perms in ${channel.name} (${channel.id})`, err));
        return;
    }

    await channel.permissionOverwrites.edit(Bot.user, { SEND_MESSAGES: true, SEND_MESSAGES_IN_THREADS: true })
        .catch(err => Bot.log.error(`error while changing perms in ${channel.name} (${channel.id})`, err));
    await channel.permissionOverwrites.edit(iwa, { SEND_MESSAGES: false, SEND_MESSAGES_IN_THREADS: false })
        .catch(err => Bot.log.error(`error while changing perms in ${channel.name} (${channel.id})`, err));
});

setInterval(async () => {
    await Bot.guilds.fetch();
    let guilds = Bot.guilds.cache;

    for (const guild of guilds) {
        await Bot.muteInGuild(guild[1]);
    }
    Bot.log.info('perms updated everywhere');
}, 3600000);

// Login
Bot.start(process.env.TOKEN);