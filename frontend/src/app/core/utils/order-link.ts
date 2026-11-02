/** Fills `{placeholder}` tokens; unknown tokens are left untouched. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/**
 * Link that sends an order to the shop's X (Twitter) DMs. With the numeric
 * account ID the DM opens with the message prefilled; with only the username
 * it opens the profile, where the visitor taps "Message".
 */
export function buildXOrderUrl(username: string, userId: string, message: string): string | null {
  const id = userId.replace(/\D/g, '');
  if (id) {
    const text = message.trim();
    return `https://x.com/messages/compose?recipient_id=${id}${text ? `&text=${encodeURIComponent(text)}` : ''}`;
  }
  const handle = username.replace(/^@/, '').trim();
  return handle ? `https://x.com/${encodeURIComponent(handle)}` : null;
}
