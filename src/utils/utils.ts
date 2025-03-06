export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  if (isNaN(date.getTime())) return "Data inválida";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatCPF(cpf: string): string {
  const cleanedValue = cpf.replace(/\D/g, "").slice(0, 11);

  return cleanedValue
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
};
