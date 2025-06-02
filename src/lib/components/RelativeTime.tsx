import {useEffect, useState} from 'react';

type Props = {
  date: string | Date;
  prefix?: string;
};

export default function RelativeTime({date, prefix}: Props) {
  const [relative, setRelative] = useState<string | null>(null);

  useEffect(() => {
    const d = new Date(date);
    setRelative(getRelativeTimeString(d));

    const interval = setInterval(() => {
      setRelative(getRelativeTimeString(d));
    }, 5_000); // update every 5s

    return () => clearInterval(interval);
  }, [date]);

  if (!relative) return null;

  return (
    <span suppressHydrationWarning>
      {prefix}
      {relative}
    </span>
  );
}

export function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language,
): string {
  const timeMs = typeof date === 'number' ? date : date.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ];
  const unitIndex = cutoffs.findIndex(
    cutoff => cutoff > Math.abs(deltaSeconds),
  );
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  const rtf = new Intl.RelativeTimeFormat(lang, {numeric: 'auto'});
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
