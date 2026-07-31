export type PayMethod = "pix" | "card";

export type PixPaymentResult = {
  ok: true;
  paymentId: string;
  status: string;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl?: string;
  expiresAt: string | null;
};

export type CardPaymentResult = {
  ok: true;
  paymentId: string;
  status: string;
  statusDetail: string;
  approved: boolean;
};

/** Mensagens amigáveis para os motivos de recusa do Mercado Pago. */
export const CARD_STATUS_MESSAGES: Record<string, string> = {
  cc_rejected_bad_filled_card_number: "Número do cartão incorreto.",
  cc_rejected_bad_filled_date: "Data de validade incorreta.",
  cc_rejected_bad_filled_other: "Confira os dados do cartão e tente de novo.",
  cc_rejected_bad_filled_security_code: "Código de segurança (CVV) incorreto.",
  cc_rejected_blacklist: "Não foi possível processar este cartão.",
  cc_rejected_call_for_authorize: "Autorize o valor com seu banco e tente de novo.",
  cc_rejected_card_disabled: "Cartão desativado. Ligue para o banco para ativá-lo.",
  cc_rejected_card_error: "Não foi possível processar o pagamento com este cartão.",
  cc_rejected_duplicated_payment: "Você já fez um pagamento deste valor.",
  cc_rejected_high_risk: "Pagamento recusado por segurança. Tente outro cartão ou pague no PIX.",
  cc_rejected_insufficient_amount: "Saldo ou limite insuficiente.",
  cc_rejected_invalid_installments: "Este cartão não aceita esse número de parcelas.",
  cc_rejected_max_attempts: "Muitas tentativas. Use outro cartão.",
  cc_rejected_other_reason: "O banco recusou o pagamento. Tente outro cartão.",
  pending_contingency: "Estamos processando seu pagamento. Você receberá o resultado por e-mail.",
  pending_review_manual: "Estamos revisando seu pagamento. Avisaremos por e-mail em instantes.",
};

export function cardStatusMessage(statusDetail: string) {
  return (
    CARD_STATUS_MESSAGES[statusDetail] ??
    "Não foi possível concluir o pagamento. Tente outro cartão ou pague no PIX."
  );
}