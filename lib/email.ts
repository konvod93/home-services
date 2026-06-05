import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({
  clientEmail,
  clientName,
  serviceName,
  masterName,
  date,
  time,
  address,
}: {
  clientEmail: string;
  clientName: string;
  serviceName: string;
  masterName: string;
  date: string;
  time: string;
  address: string;
}) {
  await resend.emails.send({
    from: "homefix <onboarding@resend.dev>",
    to: clientEmail,
    subject: `Заказ подтверждён — ${serviceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0a0a0a;">Ваш заказ принят ✓</h2>
        <p>Привет, ${clientName}!</p>
        <p>Ваш заказ успешно оформлен. Вот детали:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #666;">Услуга</td><td style="padding: 8px 0; font-weight: 600;">${serviceName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Мастер</td><td style="padding: 8px 0; font-weight: 600;">${masterName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Дата</td><td style="padding: 8px 0; font-weight: 600;">${date}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Время</td><td style="padding: 8px 0; font-weight: 600;">${time}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Адрес</td><td style="padding: 8px 0; font-weight: 600;">${address}</td></tr>
        </table>
        <p style="color: #666; font-size: 14px;">Мастер свяжется с вами перед визитом.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервис домашних мастеров</p>
      </div>
    `,
  });
}

export async function sendOrderStatusUpdate({
  clientEmail,
  clientName,
  serviceName,
  status,
  orderId,
}: {
  clientEmail: string;
  clientName: string;
  serviceName: string;
  status: string;
  orderId: string;
}) {
  const statusMessages: Record<string, string> = {
    CONFIRMED: "Мастер подтвердил ваш заказ и скоро будет",
    IN_PROGRESS: "Мастер приступил к работе",
    DONE: "Работа выполнена. Пожалуйста, оставьте отзыв",
    CANCELLED: "К сожалению, заказ был отменён",
  };

  const message = statusMessages[status];
  if (!message) return;

  await resend.emails.send({
    from: "homefix <onboarding@resend.dev>",
    to: clientEmail,
    subject: `Обновление заказа — ${serviceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0a0a0a;">Статус заказа изменился</h2>
        <p>Привет, ${clientName}!</p>
        <p>${message}.</p>
        <p><strong>${serviceName}</strong></p>
        <a href="https://konvod-home-services.vercel.app/orders/${orderId}" 
           style="display: inline-block; background: #fbbf24; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Посмотреть заказ
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервис домашних мастеров</p>
      </div>
    `,
  });
}