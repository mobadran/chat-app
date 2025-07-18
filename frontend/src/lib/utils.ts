import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ISOString format: YYYY-MM-DDTHH:mm:ss.sssZ
// Example: 2025-07-18T04:22:33.000Z
// Formatted example: 7/18/25, 4:22 AM
export function formatMessageTimestamp(isoString: string): string {
  const messageDate = new Date(isoString);
  const now = new Date();

  // Local date without time
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

  const msInDay = 86400000;
  const diffDays = Math.floor((messageDay.getTime() - today.getTime()) / msInDay);

  const timeString = messageDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (diffDays === 0) {
    return timeString; // Today
  } else if (diffDays === -1) {
    return `Yesterday, ${timeString}`;
  } else if (diffDays === 1) {
    return `Tomorrow, ${timeString} (what?)`;
  } else {
    // fallback to normal date + time
    return messageDate.toLocaleString(undefined, {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
