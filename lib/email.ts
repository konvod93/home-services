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
    subject: `Замовлення прийнято — ${serviceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0a0a0a;">Ваше замовлення прийнято ✓</h2>
        <p>Привіт, ${clientName}!</p>
        <p>Ваше замовлення успішно оформлено. Ось деталі:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #666;">Послуга</td><td style="padding: 8px 0; font-weight: 600;">${serviceName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Майстер</td><td style="padding: 8px 0; font-weight: 600;">${masterName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Дата</td><td style="padding: 8px 0; font-weight: 600;">${date}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Час</td><td style="padding: 8px 0; font-weight: 600;">${time}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Адреса</td><td style="padding: 8px 0; font-weight: 600;">${address}</td></tr>
        </table>
        <p style="color: #666; font-size: 14px;">Майстер зв’яжеться з вами перед візитом.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервіс домашніх майстрів</p>
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
    CONFIRMED: "Майстер підтвердив ваше замовлення",
    IN_PROGRESS: "Майстер приступив до роботи",
    DONE: "Роботу виконано. Будь ласка, підтвердіть виконання та залиште відгук",
    CANCELLED: "На жаль, замовлення було скасовано",
  };

  const message = statusMessages[status];
  if (!message) return;

  await resend.emails.send({
    from: "homefix <onboarding@resend.dev>",
    to: clientEmail,
    subject: `Оновлення замовлення — ${serviceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0a0a0a;">Статус замовлення змінився</h2>
        <p>Привіт, ${clientName}!</p>
        <p>${message}.</p>
        <p><strong>${serviceName}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}"
           style="display: inline-block; background: #fbbf24; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Переглянути замовлення
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервіс домашніх майстрів</p>
      </div>
    `,
  });
}

export async function sendNewOrderNotificationToMaster({
  masterEmail,
  masterName,
  clientName,
  serviceName,
  date,
  time,
  address,
  comment,
}: {
  masterEmail: string;
  masterName: string;
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  comment?: string | null;
}) {
  await resend.emails.send({
    from: "homefix <onboarding@resend.dev>",
    to: masterEmail,
    subject: `Нове замовлення — ${serviceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0a0a0a;">Нове замовлення 🔧</h2>
        <p>Привіт, ${masterName}!</p>
        <p>У вас нове замовлення. Підтвердьте його в кабінеті майстра.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #666;">Послуга</td><td style="padding: 8px 0; font-weight: 600;">${serviceName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Клієнт</td><td style="padding: 8px 0; font-weight: 600;">${clientName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Дата</td><td style="padding: 8px 0; font-weight: 600;">${date}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Час</td><td style="padding: 8px 0; font-weight: 600;">${time}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Адреса</td><td style="padding: 8px 0; font-weight: 600;">${address}</td></tr>
          ${comment ? `<tr><td style="padding: 8px 0; color: #666;">Коментар</td><td style="padding: 8px 0;">${comment}</td></tr>` : ""}
        </table>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/master"
           style="display: inline-block; background: #fbbf24; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Перейти в кабінет
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервіс домашніх майстрів</p>
      </div>
    `,
  });
}

export async function sendComplaintNotificationToAdmin({
  adminEmail,
  clientName,
  masterName,
  serviceName,
  reason,
}: {
  adminEmail: string;
  clientName: string;
  masterName: string;
  serviceName: string;
  reason: string;
}) {
  await resend.emails.send({
    from: "homefix <onboarding@resend.dev>",
    to: adminEmail,
    subject: `Нова скарга від ${clientName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #ef4444;">Нова скарга ⚠️</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #666;">Клієнт</td><td style="padding: 8px 0; font-weight: 600;">${clientName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Майстер</td><td style="padding: 8px 0; font-weight: 600;">${masterName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Послуга</td><td style="padding: 8px 0; font-weight: 600;">${serviceName}</td></tr>
        </table>
        <div style="background: #f4f4f5; border-radius: 8px; padding: 12px; margin: 16px 0;">
          <p style="color: #333; margin: 0;">${reason}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/complaints"
           style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Розглянути скаргу
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервіс домашніх майстрів</p>
      </div>
    `,
  });
}

export async function sendMasterBlockedNotification({
  masterEmail,
  masterName,
}: {
  masterEmail: string;
  masterName: string;
}) {
  await resend.emails.send({
    from: "homefix <onboarding@resend.dev>",
    to: masterEmail,
    subject: "Ваш акаунт заблоковано",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #ef4444;">Акаунт заблоковано 🚫</h2>
        <p>Привіт, ${masterName}!</p>
        <p>Ваш акаунт було заблоковано на підставі скарги клієнта. Ви тимчасово не можете приймати нові замовлення.</p>
        <p>Якщо ви вважаєте блокування необґрунтованим, ви можете подати заявку на розблокування, додавши підтверджуючі документи.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/master/unblock"
           style="display: inline-block; background: #fbbf24; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Подати заявку на розблокування
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервіс домашніх майстрів</p>
      </div>
    `,
  });
}

export async function sendMasterUnblockedNotification({
  masterEmail,
  masterName,
}: {
  masterEmail: string;
  masterName: string;
}) {
  await resend.emails.send({
    from: "homefix <onboarding@resend.dev>",
    to: masterEmail,
    subject: "Ваш акаунт розблоковано",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #22c55e;">Акаунт розблоковано ✓</h2>
        <p>Привіт, ${masterName}!</p>
        <p>Вашу заявку на розблокування було схвалено. Ви знову можете приймати замовлення.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/master"
           style="display: inline-block; background: #fbbf24; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Перейти в кабінет майстра
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px;">homefix — сервіс домашніх майстрів</p>
      </div>
    `,
  });
}