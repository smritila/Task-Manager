const longDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const longDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Not available';
  }

  return longDateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return 'Not set';
  }

  return longDateTimeFormatter.format(new Date(value));
}
