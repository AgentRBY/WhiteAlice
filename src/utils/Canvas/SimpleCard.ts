import { Canvas, loadImage, SKRSContext2D } from '@napi-rs/canvas';
import { CanvasUtils } from './Utils';
import { GuildMember } from 'discord.js';
import { UserProfile } from '../../typings/MemberModel';

enum Colors {
  Background = '#2f4e88',
  Text = '#ffffff',
}

export class SimpleCard {
  private STATUS_COLORS = {
    online: '#43B581',
    idle: '#F8A51A',
    dnd: '#E54747',
    offline: '#4a4d53',
  };

  public width = 900;
  public height = 200;

  public canvas: Canvas;
  public context: SKRSContext2D;

  private member: GuildMember;
  protected profile: UserProfile;

  constructor(member: GuildMember, profile: UserProfile) {
    this.canvas = new Canvas(this.width, this.height);
    this.context = this.canvas.getContext('2d');

    this.member = member;
    this.profile = profile;
  }

  protected drawBackground() {
    this.context.fillStyle = Colors.Background;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  protected async drawAvatar(withStatus = true) {
    // Make image rounded
    this.context.save();
    CanvasUtils.clipCircle(this.context, 100, 100, 80);

    if (withStatus) {
      // Clip transparent circle for status
      CanvasUtils.clipCircle(this.context, 154, 154, 20, true);
    }

    const avatar = await loadImage(this.member.user.displayAvatarURL({ format: 'jpg', size: 256 }));
    this.context.drawImage(avatar, 20, 20, 162, 162);

    this.context.restore();

    if (withStatus) {
      // Draw border for status
      this.context.save();
      CanvasUtils.clipCircle(this.context, 100, 100, 82);
      CanvasUtils.drawCircle(this.context, 154, 154, 18, '#FFFFFF', 'stroke', 2);
      this.context.restore();
    }

    // Draw avatar border
    this.context.save();
    if (withStatus) {
      // Don't draw avatar border on status
      CanvasUtils.clipCircle(this.context, 154, 154, 18, true);
    }
    CanvasUtils.drawCircle(this.context, 100, 100, 82, '#FFFFFF', 'stroke', 2);
    this.context.restore();

    if (withStatus) {
      CanvasUtils.drawCircle(this.context, 154, 154, 12, this.STATUS_COLORS[this.member.presence.status]);
    }
  }

  protected drawUsername() {
    CanvasUtils.drawText({
      context: this.context,
      text: this.member.displayName,
      x: 220,
      y: 62,
      fontSize: 35,
      color: Colors.Text,
      adjust: true,
      adjustMaxWidth: this.width - 150 - 220,
    });
  }

  public async drawCard() {
    this.drawBackground();
    await this.drawAvatar();
    this.drawUsername();
  }

  public async render() {
    return this.canvas.encode('png');
  }
}
