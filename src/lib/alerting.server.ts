/**
 * Alertas de pagamento — envia notificações para Discord/Slack quando há
 * falhas no checkout ou instabilidade no Mercado Pago.
 *
 * Nunca expõe dados pessoais completos (CPF, telefone, e-mail, nome).
 */

type AlertLevel = "critical" | "warning" | "info";

type AlertPayload = {
  level: AlertLevel;
  title: string;
  message: string;
  context?: Record<string, unknown>;
};

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  const maskedUser = user.length > 3 ? `${user.slice(0, 3)}***` : "***";
  return `${maskedUser}@${domain}`;
}

function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "***";
  return parts
    .map((part, index) => (index === 0 ? `${part[0] ?? ""}***` : part[0] ? `${part[0]}***` : "***"))
    .join(" ");
}

export function sanitizeContext(input?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!input) return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === "email" && typeof value === "string") {
      out[key] = maskEmail(value);
    } else if (key === "name" && typeof value === "string") {
      out[key] = maskName(value);
    } else if (key === "cpf" || key === "phone" || key === "token" || key === "issuerId") {
      out[key] = "***";
    } else {
      out[key] = value;
    }
  }
  return out;
}

function levelEmoji(level: AlertLevel): string {
  switch (level) {
    case "critical":
      return "🚨";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
  }
}

function buildDiscordEmbed(payload: AlertPayload) {
  const sanitized = sanitizeContext(payload.context);
  const fields = sanitized
    ? Object.entries(sanitized).map(([name, value]) => ({
        name: String(name),
        value: String(value).slice(0, 1000),
        inline: true,
      }))
    : [];

  return {
    embeds: [
      {
        title: `${levelEmoji(payload.level)} ${payload.title}`,
        description: payload.message,
        color: payload.level === "critical" ? 15158332 : payload.level === "warning" ? 16776960 : 3447003,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

function buildSlackPayload(payload: AlertPayload) {
  const sanitized = sanitizeContext(payload.context);
  const fields = sanitized
    ? Object.entries(sanitized)
        .map(([key, value]) => `*${key}:* ${String(value).slice(0, 100)}`)
        .join("\n")
    : "";

  return {
    text: `${levelEmoji(payload.level)} *${payload.title}*`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${levelEmoji(payload.level)} *${payload.title}*\n${payload.message}`,
        },
      },
      ...(fields
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: fields,
              },
            },
          ]
        : []),
    ],
  };
}

async function postToWebhook(url: string, body: unknown): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook ${response.status}: ${text.slice(0, 200)}`);
  }
}

export async function sendPaymentAlert(payload: AlertPayload): Promise<void> {
  const discordUrl = process.env.DISCORD_WEBHOOK_URL;
  const slackUrl = process.env.SLACK_WEBHOOK_URL;

  if (!discordUrl && !slackUrl) {
    // Nenhum destino configurado: loga silenciosamente no servidor.
    console.warn("[alerting] nenhum webhook configurado para alertas de pagamento", payload.title);
    return;
  }

  const results = await Promise.allSettled([
    discordUrl ? postToWebhook(discordUrl, buildDiscordEmbed(payload)) : Promise.resolve(),
    slackUrl ? postToWebhook(slackUrl, buildSlackPayload(payload)) : Promise.resolve(),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[alerting] falha ao enviar alerta", result.reason);
    }
  }
}
