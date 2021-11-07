import Bot from '../Client';

export default async function ready() {
    Bot.user.setStatus('idle');
}