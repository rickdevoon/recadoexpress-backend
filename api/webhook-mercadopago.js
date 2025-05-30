import dotenv from "dotenv";
dotenv.config();

import mercadopago from "mercadopago";
import fetch from "node-fetch";

mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

export default async function handler(req, res) {
  const { topic, id } = req.query;
  if (topic !== "payment") {
    return res.status(200).send("Ignored");
  }

  try {
    const { body: payment } = await mercadopago.payment.get(id);
    const data = JSON.parse(payment.external_reference);
    const { remetente, destinatario, contato, recado } = data;

    console.log("Disparando EmailJS para:", data);

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      from_name: remetente || "Anônimo",
      to_name: destinatario,
      method: contato,        // o campo “Como entregar o recado?”
      contact_info: contato,  // a informação de contato do destinatário
      message: recado
    },
  }),
});

    console.log("Recado enviado por EmailJS!");
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.status(500).send("Erro no webhook");
  }
}
