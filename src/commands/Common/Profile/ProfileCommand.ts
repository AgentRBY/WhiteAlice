import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { MessageAttachment } from 'discord.js';
import { getMemberFromMessage } from '../../../utils/Discord/Users';
import { client } from '../../../app';
import { getMemberBaseId } from '../../../utils/Other';
import { LevelCard } from '../../../utils/Canvas/LevelCard';

class Profile extends CommonCommand {
  name = 'profile';
  category = 'Profile';
  aliases = ['p'];
  description = '';
  examples: CommandExample[] = [];
  usage = 'profile';

  async run({ message }: CommandRunOptions) {
    const targetMember = getMemberFromMessage(message) || message.member;

    const profile = await client.service.getMemberProfile(getMemberBaseId(targetMember));

    const levelCard = new LevelCard(targetMember, profile);
    await levelCard.drawCard();

    const attachment = new MessageAttachment(await levelCard.render(), 'profile-image.png');

    message.reply({ files: [attachment] });
  }
}

export default new Profile();
