export function formatFullDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',    
    day: 'numeric',     
    month: 'long',     
    year: 'numeric'     
  }).format(date);
}

export function formatFullDateCapitalized(date: Date = new Date()): string {
  const formatted = formatFullDate(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatShortDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}