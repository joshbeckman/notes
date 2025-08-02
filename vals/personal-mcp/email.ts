import { sqlite } from "https://esm.town/v/std/sqlite";
// interface Email {
//   from: string;
//   to: string[];
//   cc: string | string[] | undefined;
//   bcc: string | string[] | undefined;
//   subject: string | undefined;
//   text: string | undefined;
//   html: string | undefined;
//   attachments: File[];
// }
const KNOWN_SENDERS = [
    'josh@joshbeckman.org',
];
export default async function (e: Email) {
    // e.from is going to be something like "Josh Beckman <josh@joshbeckman.org>"
    // we want to extract the email address from it
    let fromSender = e.from.match(/<([^>]+)>/);
    if (!fromSender) {
        fromSender = e.from.match(/([^<\s]+@[^>\s]+)/);
    }
    if (!fromSender) {
        fromSender = [null, e.from];
    }
    if (!KNOWN_SENDERS.includes(fromSender[1])) {
        console.warn(`Email from unknown sender: ${e.from}`);
        console.log(e);
        return;
    }
    const body = e.text || e.html || '';
    // Match "To: username" pattern, handling both \n and \r newlines
    // Username must start and end with alphanumeric, can contain letters, numbers, dots, underscores, hyphens
    const toMatch = body.match(/To:\s*([a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9])(?:[\r\n]|$)/);
    await sqlite.execute({
      sql: `INSERT INTO personal_mcp_emails (subject, body, from_sender, to_recipient, reply_to) VALUES (?, ?, ?, ?, ?)`,
      args: [e.subject || '', body, fromSender[1], toMatch ? toMatch[1] : '', e.replyTo || e.from],
    });
}
