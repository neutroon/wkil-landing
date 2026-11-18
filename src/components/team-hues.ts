/** One hue per team member, so a member looks the same in the diagram, the cards and the chat. */
const hues: Record<string, number> = {
  manager: 210,
  support: 183,
  whatsapp: 150,
  content: 300,
  knowledge: 75,
  reports: 255,
  custom: 25,
};

export function memberHue(key: string) {
  return hues[key] ?? 190;
}
