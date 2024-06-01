export function parseDateToDateAndMonth(dateStr: string): {
  day: number;
  dayOfWeek: string;
  month: { name: string; number: number };
  year: number;
} {
  const inputDate = new Date(dateStr);
  const monthNamesRu = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const dayNames = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];
  const dateObj = { day: inputDate.getDate(), year: inputDate.getFullYear() };
  const dayOfWeek = dayNames[inputDate.getDay()];
  const monthObj = {
    name: monthNamesRu[inputDate.getMonth()],
    number: inputDate.getMonth() + 1,
  };
  return {
    day: dateObj.day,
    dayOfWeek: dayOfWeek,
    month: monthObj,
    year: dateObj.year,
  };
}

export function convertDateFormatToDashFormat(dateString?: string): string {
  if (dateString?.length === 0 || !dateString) return "";

  // Check if the dateString is in YYYY-MM-DD format
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (isoDateRegex.test(dateString)) {
    return dateString;
  }

  // Otherwise, assume the dateString is in DD.MM.YYYY format
  const [day, month, year] = dateString.split(".");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
