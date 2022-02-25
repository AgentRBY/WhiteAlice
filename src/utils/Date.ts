import moment, { Duration } from 'moment';

export function getDurationFromString(text: string): Duration | undefined {
  const days = getDaysFromString(text) * 86_400_000;
  const hours = getHoursFromString(text) * 3_600_000;
  const minutes = getMinutesFromString(text) * 60_000;

  const durationInMilliseconds = days + hours + minutes;

  console.log(days);
  console.log(minutes);
  console.log(durationInMilliseconds);

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

  return formatterArray.join(", ")
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
