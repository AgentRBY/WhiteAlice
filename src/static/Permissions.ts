import { PermissionString } from 'discord.js';

const Permissions: Record<PermissionString, string> = {
  ADMINISTRATOR: 'Администратор',
  CREATE_INSTANT_INVITE: 'Создавать приглашения',
  KICK_MEMBERS: 'Выгонять участников',
  BAN_MEMBERS: 'Банить участников',
  MANAGE_CHANNELS: 'Управлять каналами',
  MANAGE_GUILD: 'Управлять сервером',
  ADD_REACTIONS: 'Добавлять реакции',
  VIEW_AUDIT_LOG: 'Просматривать журнал аудита',
  PRIORITY_SPEAKER: 'Приоритетный режим',
  STREAM: 'Видео',
  VIEW_CHANNEL: 'Просматривать канал',
  SEND_MESSAGES: 'Отправлять сообщения',
  SEND_TTS_MESSAGES: 'Отправлять TTS сообщения',
  MANAGE_MESSAGES: 'Управлять сообщениями',
  EMBED_LINKS: 'Встраивать ссылки',
  ATTACH_FILES: 'Прикреплять файлы',
  READ_MESSAGE_HISTORY: 'Читать историю сообщений',
  MENTION_EVERYONE: 'Упоминание @everyone, @here и всех ролей',
  USE_EXTERNAL_EMOJIS: 'использовать внешние эмодзи',
  VIEW_GUILD_INSIGHTS: 'Просмотр аналитики сервера',
  CONNECT: 'Присоединятся',
  SPEAK: 'Говорить',
  MUTE_MEMBERS: 'Отключать участникам микрофон',
  DEAFEN_MEMBERS: 'Отключать участникам звук',
  MOVE_MEMBERS: 'Перемещать участников',
  USE_VAD: 'Использовать VAD',
  CHANGE_NICKNAME: 'Изменять никнейм',
  MANAGE_NICKNAMES: 'Управлять никнеймами',
  MANAGE_ROLES: 'Управлять ролями',
  MANAGE_WEBHOOKS: 'Управлять вебхуками',
  MANAGE_EMOJIS_AND_STICKERS: 'Управлять эмодзи',
  CREATE_PRIVATE_THREADS: 'Создавать приватные ветки',
  CREATE_PUBLIC_THREADS: 'Создавать публичные ветки',
  MANAGE_EVENTS: 'Управлять событиями',
  MANAGE_THREADS: 'Управлять ветками',
  MODERATE_MEMBERS: 'Выдавать пользователям тайм-аут',
  REQUEST_TO_SPEAK: 'Запрос на разговор',
  SEND_MESSAGES_IN_THREADS: 'Отправлять сообщения в ветки',
  START_EMBEDDED_ACTIVITIES: 'Возможность запускать встроенные приложения в голосовом канале',
  USE_APPLICATION_COMMANDS: 'Использовать команды приложения',
  USE_EXTERNAL_STICKERS: 'Использовать внешние стикеры',
  USE_PRIVATE_THREADS: 'Использовать приватные ветки',
  USE_PUBLIC_THREADS: 'Использовать публичные ветки',
  SEND_VOICE_MESSAGES: 'Отправлять голосовые сообщения',
  USE_SOUNDBOARD: 'Использовать Саундборд',
  VIEW_CREATOR_MONETIZATION_ANALYTICS: 'Просматривать аналитику монетизации создателей контента',
};

export default Permissions;
