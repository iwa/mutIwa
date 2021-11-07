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
            if (channel[1].isThread()) return;

            await channel[1].permissionOverwrites.edit(iwa, { SEND_MESSAGES: false, SEND_MESSAGES_IN_THREADS: false });
        }
    }

    public async start(token: string) {
        await this.login(token);
    }
}