import dotenv from "dotenv";
dotenv.config();

import Bot from './Client';
import ready from './events/ready';

// Process related Events
process.on('uncaughtException', async exception => Bot.log.error(exception));
process.on('unhandledRejection', async exception => Bot.log.error(exception));

// Bot-User related Events
Bot.on('warn', (warn) => Bot.log.warn(warn));
Bot.on('shardError', (error) => Bot.log.error(error));
Bot.on('shardDisconnect', (event) => Bot.log.debug({ msg: "iwabot disconnected", event: event }));
Bot.on('shardReconnecting', (event) => Bot.log.debug({ msg: "iwabot reconnecting", event: event }));
Bot.on('shardResume', async () => await ready());
Bot.once('shardReady', async () => {
    await ready();
    Bot.log.debug(`logged in as ${Bot.user.username}`);
});

Bot.on('guildCreate', async (guild) => {
    await Bot.muteInGuild(guild);
});

Bot.on('channelCreate', async (channel) => {
    if (channel.name.startsWith('ticket')) return;

    let iwa = await Bot.fetchIwa();
    await channel.permissionOverwrites.edit(iwa, { SEND_MESSAGES: false, SEND_MESSAGES_IN_THREADS: false });
});

setInterval(async () => {
    await Bot.guilds.fetch();
    let guilds = Bot.guilds.cache;

    for (const guild of guilds) {
        await Bot.muteInGuild(guild[1]);
    }
}, 3600000);

// Login
Bot.start(process.env.TOKEN);