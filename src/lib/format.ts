const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// Recebe AAAA-MM-DD e não passa por Date, para o fuso não alterar o dia.
export function formatEventDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${Number(day)} de ${MONTHS[Number(month) - 1]} de ${year}`;
}
