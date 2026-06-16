import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-zinc-500 hover:text-white text-sm transition-colors mb-8 inline-flex items-center gap-1">
          ← На головну
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Політика конфіденційності</h1>
        <p className="text-zinc-500 text-sm mb-10">Останнє оновлення: червень 2026</p>

        <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Які дані ми збираємо</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Ім’я, email, номер телефону при реєстрації</li>
              <li>Адреса виконання робіт при оформленні замовлення</li>
              <li>Документи для верифікації майстрів (фото з паспортом, дипломи)</li>
              <li>Дані про замовлення, платежі та відгуки</li>
              <li>Технічні дані: IP-адреса, браузер, час відвідування</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Як ми використовуємо дані</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Для надання послуг платформи та обробки замовлень</li>
              <li>Для верифікації особи майстрів</li>
              <li>Для надсилання повідомлень про статус замовлень</li>
              <li>Для вирішення спорів між клієнтами та майстрами</li>
              <li>Для покращення роботи сервісу</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. Зберігання даних</h2>
            <p>Дані зберігаються на захищених серверах. Документи верифікації майстрів зберігаються на серверах Uploadthing і доступні лише адміністраторам платформи. Платіжні дані обробляються LiqPay і не зберігаються на наших серверах.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Передача даних третім особам</h2>
            <p>Ми не продаємо і не передаємо ваші персональні дані третім особам, за винятком:</p>
            <ul className="space-y-2 list-disc list-inside mt-2">
              <li>Платіжна система LiqPay — для обробки платежів</li>
              <li>Uploadthing — для зберігання файлів</li>
              <li>Resend — для надсилання email повідомлень</li>
              <li>Правоохоронні органи — за законною вимогою</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Контакти між клієнтом і майстром</h2>
            <p>Номер телефону майстра надається клієнту лише після оплати замовлення. Номер телефону клієнта надається майстру лише після підтвердження оплати. Це захищає обидві сторони від небажаного контакту.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Ваші права</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Право на доступ до своїх даних</li>
              <li>Право на виправлення неточних даних</li>
              <li>Право на видалення акаунту та персональних даних</li>
              <li>Право на отримання копії своїх даних</li>
            </ul>
            <p className="mt-3">Для реалізації своїх прав зверніться до адміністрації: admin@homefix.com</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Файли cookie</h2>
            <p>Сервіс використовує необхідні файли cookie для аутентифікації та безпеки. Ми не використовуємо рекламні або трекінгові cookie.</p>
          </section>
        </div>
      </div>
    </div>
  );
}