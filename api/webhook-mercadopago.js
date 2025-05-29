// api/webhook-mercadopago.js
import mercadopago from "mercadopago";

// configura token do Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

export default async function handler(req, res) {
  // Mercado Pago envia query strings como ?topic=payment&id=...
  const { topic, id } = req.query;

  if (topic !== "payment") {
    return res.status(200).send("Ignored");
  }

  try {
    // busca dados do pagamento
    const payment = await mercadopago.payment.get(id);
    console.log("Pagamento recebido:", payment.body);

    // TODO: aqui você pode:
    // 1) Salvar no banco que o recado está pago
    // 2) Disparar o EmailJS para enviar o recado
    //    Exemplo de chamada (fetch) ao EmailJS no backend:
    //
    // await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     service_id: process.env.EMAILJS_SERVICE_ID,
    //     template_id: process.env.EMAILJS_TEMPLATE_ID,
    //     user_id: process.env.EMAILJS_PUBLIC_KEY,
    //     template_params: {
    //       recado: /* texto do recado */,
    //       destinatario: /* nome */,
    //       remetente: /* nome opcional */,
    //       contato: /* meio e contato */,
    //     }
    //   })
    // });

    res.status(200).send("OK");
  } catch (err) {
    console.error("Erro no webhook:", err);
    res.status(500).send("Erro");
  }
}
