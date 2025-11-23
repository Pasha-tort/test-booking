export function snakeToCamel(str: string, removePart?: string): string {
  if (!str) return '';

  let result = str.trim();

  if (removePart) {
    const escaped = removePart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // экранируем regex-символы
    result = result.replace(new RegExp(escaped, 'i'), '');
  }

  return result.toLowerCase().replace(/_([a-z])/g, (_, l) => l.toUpperCase());
}
