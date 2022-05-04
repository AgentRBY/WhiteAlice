import moment, { Duration } from 'moment';
import { Moment } from 'moment/moment';

export function getDurationFromString(text: string): Duration | undefined {
  const days = getDaysFromString(text) * 86_400_000;
  const hours = getHoursFromString(text) * 3_600_000;
  const minutes = getMinutesFromString(text) * 60_000;

  const durationInMilliseconds = days + hours + minutes;

  if (!durationInMilliseconds) {
    return;
  }

  return moment.duration(durationInMilliseconds);
}

export function formatDuration(duration: Duration): string {
  const days = duration.days() * 86_400_000;
  const hours = duration.hours() * 3_600_000;
  const minutes = duration.minutes() * 60_000;

  const formattedDays = days ? moment.duration(days).locale('ru').humanize() : '';
  const formattedHours = hours ? moment.duration(hours).locale('ru').humanize() : '';
  const formattedMinutes = minutes ? moment.duration(minutes).locale('ru').humanize() : '';

  const formatterArray = [formattedDays, formattedHours, formattedMinutes].filter((item) => item);

  return formatterArray.join(', ');
}

export function formatDurationInPast(duration: Duration): string {
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  const formattedDays = days ? formatDays(days) : '';
  const formattedHours = hours ? formatHours(hours) : '';
  const formattedMinutes = minutes ? formatMinutes(minutes) : '';

  const formatterArray = [formattedDays, formattedHours, formattedMinutes].filter((item) => item);

  return formatterArray.join(', ');
}

export function formatDays(days: number): string {
  if (days === 1 || days === 21) {
    return `${days} день`;
  }

  if ((days > 1 && days < 5) || (days > 21 && days < 25)) {
    return `${days} дня`;
  }

  if (days > 4 && days < 21) {
    return `${days} дней`;
  }
}

export function formatHours(hours: number): string {
  if (hours === 1 || hours === 21 || hours === 31 || hours === 41 || hours === 51) {
    return `${hours} час`;
  }

  if (
    (hours > 1 && hours < 5) ||
    (hours > 21 && hours < 25) ||
    (hours > 31 && hours < 35) ||
    (hours > 41 && hours < 45) ||
    (hours > 51 && hours < 55)
  ) {
    return `${hours} часа`;
  }

  if (
    (hours > 4 && hours < 21) ||
    (hours > 24 && hours < 31) ||
    (hours > 34 && hours < 41) ||
    (hours > 44 && hours < 51) ||
    (hours > 54 && hours < 61)
  ) {
    return `${hours} часов`;
  }
}

export function formatMinutes(minutes: number): string {
  if (minutes === 1 || minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51) {
    return `${minutes} минута`;
  }

  if (
    (minutes > 1 && minutes < 5) ||
    (minutes > 21 && minutes < 25) ||
    (minutes > 31 && minutes < 35) ||
    (minutes > 41 && minutes < 45) ||
    (minutes > 51 && minutes < 55)
  ) {
    return `${minutes} минуты`;
  }

  if (
    (minutes > 4 && minutes < 21) ||
    (minutes > 24 && minutes < 31) ||
    (minutes > 34 && minutes < 41) ||
    (minutes > 44 && minutes < 51) ||
    (minutes > 54 && minutes < 61)
  ) {
    return `${minutes} минут`;
  }
}

export function getDaysFromString(text: string): number {
  const DAYS_REGEX = /(\d{1,2})(?:d|day|days|д|день|дня|дней)/;
  const result = DAYS_REGEX.exec(text);

  if (!result) {
    return 0;
  }

  return Number(result[1]);
}

export function getHoursFromString(text: string): number {
  const HOURS_REGEX = /(\d{1,2})h|hour|hours|ч|час|часа|часов/;
  const result = HOURS_REGEX.exec(text);

  if (!result) {
    return 0;
  }

  return Number(result[1] || 0);
}

export function getMinutesFromString(text: string): number {
  const MINUTES_REGEX = /(\d{1,4})m|min|minute|minutes|м|мин|минута|минуты|минут/;
  const result = MINUTES_REGEX.exec(text);

  if (!result) {
    return 0;
  }

  return Number(result[1] || 0);
}

export function momentToDiscordDate(moment: Moment, timeFormat: string = 'f') {
  return `<t:${moment.unix()}:${timeFormat}>`;
}
