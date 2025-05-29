// api/create_preference.js
import mercadopago from "mercadopago";

// configura token do Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { amount, description } = req.body;

  try {
    const preference = {
      items: [
        {
          title: description,
          quantity: 1,
          unit_price: parseFloat(amount),
        },
      ],
      back_urls: {
        success: `${process.env.BASE_URL}/pedido-confirmado`,
        failure: `${process.env.BASE_URL}/pagamento-falhou`,
        pending: `${process.env.BASE_URL}/pagamento-pendente`,
      },
      auto_return: "approved",
      notification_url: `${process.env.BASE_URL}/api/webhook-mercadopago`,
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({
      id: response.body.id,
      init_point: response.body.init_point,
    });
  } catch (err) {
    console.error("Erro create_preference:", err);
    res.status(500).json({ error: "Erro criando preferência" });
  }
}
