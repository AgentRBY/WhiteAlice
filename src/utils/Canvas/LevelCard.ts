import { SimpleCard } from './SimpleCard';
import { GuildMember } from 'discord.js';
import { UserProfile } from '../../typings/MemberModel';
import { getXpByLevel } from '../Other';
import { CanvasUtils } from './Utils';

enum Colors {
  XpBarBackground = '#BAC6DD',
  XpBarForeground = '#537ec5',
  Text = '#ffffff',
}

export class LevelCard extends SimpleCard {
  private readonly xpToNextLevel: number;

  constructor(member: GuildMember, profile: UserProfile) {
    super(member, profile);

    this.xpToNextLevel = getXpByLevel(profile.level + 1);
  }

  public async drawCard() {
    await super.drawCard();

    this.drawXpBar();
    this.drawXpText();
    this.drawLevelText();
  }

  private drawXpBar() {
    CanvasUtils.drawLine({
      context: this.context,
      width: 600,
      height: 24,
      x: 230,
      y: 140,
      style: 'round',
      color: Colors.XpBarBackground,
    });

    CanvasUtils.drawLine({
      context: this.context,
      width: (this.profile.xp / this.xpToNextLevel) * 600,
      height: 24,
      x: 229,
      y: 140,
      style: 'round',
      color: Colors.XpBarForeground,
    });
  }

  private drawXpText() {
    CanvasUtils.drawText({
      context: this.context,
      text: `${Math.round(this.profile.xp)} / ${this.xpToNextLevel}`,
      x: 795,
      y: 115,
      fontSize: 30,
      align: 'right',
      color: Colors.Text,
    });

    CanvasUtils.drawText({
      context: this.context,
      text: 'XP',
      x: 835,
      y: 115,
      fontSize: 25,
      align: 'right',
      color: Colors.Text,
    });
  }

  private drawLevelText() {
    CanvasUtils.drawText({
      context: this.context,
      text: 'LvL: ',
      x: 220,
      y: 115,
      fontSize: 25,
      color: Colors.Text,
    });

    CanvasUtils.drawText({
      context: this.context,
      text: `${this.profile.level}`,
      x: 270,
      y: 115,
      fontSize: 35,
      color: Colors.Text,
    });
  }
}
