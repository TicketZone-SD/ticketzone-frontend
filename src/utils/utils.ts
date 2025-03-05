export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  if (isNaN(date.getTime())) return "Data inválida";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}