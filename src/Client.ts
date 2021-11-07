import { Client, Guild, Intents } from "discord.js";
import log from './Logger';
import createEmbed from "./utils/createEmbed";

export default new class Bot extends Client {

    public log = log;

    public createEmbed = createEmbed;

    public constructor() {
        super({
            retryLimit: 5,
            intents: [Intents.FLAGS.GUILDS]
        });
    }

    public async fetchIwa() {
        let iwa = await this.users.fetch(process.env.IWA, { cache: true });
        return iwa;
    }

    public async muteInGuild(guild: Guild) {
        let iwa = await this.fetchIwa();
        await guild.channels.fetch();

        for (const channel of guild.channels.cache) {
            if (!channel[1].isThread() && !channel[1].isVoice()) {
                console.log(channel[1].name)

                if (channel[1].name.startsWith('ticket') || channel[1].id === '897900124452290580') {
                    await channel[1].permissionOverwrites.edit(iwa, { SEND_MESSAGES: null, SEND_MESSAGES_IN_THREADS: null })
                        .catch(err => this.log.error(`error while changing perms in ${channel[1].name} (${channel[1].id})`, err));
                } else {
                    await channel[1].permissionOverwrites.edit(this.user, { SEND_MESSAGES: true, SEND_MESSAGES_IN_THREADS: true })
                        .catch(err => this.log.error(`error while changing perms in ${channel[1].name} (${channel[1].id})`, err));
                    await channel[1].permissionOverwrites.edit(iwa, { SEND_MESSAGES: false, SEND_MESSAGES_IN_THREADS: false })
                        .catch(err => this.log.error(`error while changing perms in ${channel[1].name} (${channel[1].id})`, err));
                }
            }
        }
    }

    public async start(token: string) {
        await this.login(token);
    }
}