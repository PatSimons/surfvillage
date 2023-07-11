// dateConverter.ts

// Function to convert date elements to Dutch date format
export function convertDatesToDutchFormat(attributeName: string): void {
  const dateElements = document.querySelectorAll(`${attributeName}`);

  for (let i = 0; i < dateElements.length; i++) {
    const dateElement = dateElements[i];
    const dateText = dateElement.textContent;

    if (dateText) {
      const formattedDate = formatDateToDutch(dateText);
      dateElement.textContent = formattedDate;
    }
  }
}

// Function to format the date to Dutch format
function formatDateToDutch(dateText: string): string {
  const dateParts = dateText.split(' ');

  // Assuming the input format is Month D, Yr
  const month = dateParts[0];
  const day = dateParts[1].slice(0, -1);
  const year = dateParts[2];

  const monthIndex = getMonthIndex(month);

  if (monthIndex === -1) {
    // Return the original date if month is not recognized
    return dateText;
  }

  const formattedDate = `${day} ${getMonthInDutch(monthIndex)}, ${year}`;
  return formattedDate;
}

// Function to get the month index (0-based) based on the month name
function getMonthIndex(month: string): number {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthIndex = monthNames.findIndex(
    (monthName) => monthName.toLowerCase() === month.toLowerCase()
  );

  return monthIndex;
}

// Function to get the Dutch month name based on the month index (0-based)
function getMonthInDutch(monthIndex: number): string {
  const dutchMonths = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ];

  if (monthIndex >= 0 && monthIndex < dutchMonths.length) {
    return dutchMonths[monthIndex];
  }

  return '';
}
