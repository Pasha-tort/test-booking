export function changingHoursDate(
  date: Date,
  hours: number,
  operationType: 'subtraction' | 'addition',
) {
  const result = new Date(date);
  if (operationType === 'subtraction')
    result.setHours(result.getHours() - hours);
  else if (operationType === 'addition')
    result.setHours(result.getHours() + hours);
  return result;
}
