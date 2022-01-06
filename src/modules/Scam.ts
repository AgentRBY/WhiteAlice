import { Message } from 'discord.js';
import { ExtendClient } from '../structures/Client';

export function ScamModule(client: ExtendClient, message: Message): void {
  if (client.config.ownersID.includes(message.author.id)) {
    return;
  }

  const messageContent = message.content.toLowerCase();

  if (
    messageContent.includes('discord.com') ||
    messageContent.includes('discord.org') ||
    messageContent.includes('discordapp.org') ||
    messageContent.includes('discordapp.com')
  ) {
    return;
  }

  if (
    messageContent.includes('free') &&
    messageContent.includes('discord nitro') &&
    messageContent.includes('@everyone')
  ) {
    try {
      if (message.deletable) {
        message.delete();
      }

      if (message.guild.me.permissions.has('KICK_MEMBERS')) {
        message.member.kick(`HL_BOT | Nitro Scam`);
      }
    } catch {}
    return;
  }

  const scamLink = getScamLink(messageContent);

  if (scamLink?.length) {
    try {
      if (message.deletable) {
        message.delete();
      }

      if (message.guild.me.permissions.has('KICK_MEMBERS')) {
        message.member.kick(`HL_BOT | Scam link: ${scamLink[0]}`);
      }
    } catch {}
    return;
  }
}

export const DISCORD_NITRO_SCAM_REGEX =
  /d(?:l|i|)[ilrs][cs][crs](?:r|o|c|)[or]d(?:l?.|i?.|.|)(?:-|)(?:g[il]ft(?:.|)|g[il]ve(?:.|)|cla[il]m(?:.|)|apps?|n[il](?:i|l|)tro|)\.(?:com|gift|org|xyz|ru|ua|club|giv[ae]ewey(?:.|))/;

export function getScamLink(message: string): RegExpExecArray {
  return DISCORD_NITRO_SCAM_REGEX.exec(message);
}
