export function convertDdMmYyyyToDate(dateString: string): Date {
  // Split the string by '/' to get day, month, and year components
  const parts = dateString.split('/');

  // Ensure there are three parts (day, month, year)
  if (parts.length !== 3) {
    throw new Error('Invalid date string format. Expected dd/mm/yyyy.');
  }

  // Extract day, month, and year
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10); // Month is 0-indexed in Date constructor
  const year = parseInt(parts[2], 10);

  // Create a new Date object. Note that the month is 0-indexed, so we subtract 1.
  // Using yyyy-mm-dd format is generally more reliable for direct Date object creation.
  return new Date(year, month - 1, day);
}

export function formatDateDDMMAAAA(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // meses vão de 0 a 11
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
