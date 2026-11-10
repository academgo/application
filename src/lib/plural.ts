/**
 * Русская форма слова по числу: 1 вопрос, 2 вопроса, 5 вопросов.
 * Формы передаются в порядке «один, два, пять».
 */
export const pluralRu = (
  count: number,
  forms: [string, string, string]
): string => {
  const rest = Math.abs(count) % 100;
  const last = rest % 10;

  if (rest > 10 && rest < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];

  return forms[2];
};
