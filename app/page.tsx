import Link from "next/link";

const services = [
  { emoji: "🚿", title: "Сантехника", desc: "Замена труб, смесителей, устранение засоров" },
  { emoji: "⚡", title: "Электрика", desc: "Розетки, люстры, щитки, проводка" },
  { emoji: "🏠", title: "Ремонт", desc: "Плитка, обои, шпаклёвка, двери" },
  { emoji: "🧹", title: "Уборка", desc: "Генеральная уборка, после ремонта, мытьё окон" },
  { emoji: "🪑", title: "Мебель", desc: "Сборка кухонь, шкафов, кроватей" },
  { emoji: "🔧", title: "Другое", desc: "Любые работы по дому под ключ" },
];

const steps = [
  { num: "01", title: "Выберите услугу", desc: "Найдите нужную услугу в каталоге" },
  { num: "02", title: "Выберите мастера", desc: "Смотрите рейтинг, отзывы и цены" },
  { num: "03", title: "Выберите время", desc: "Выберите удобный слот из доступных" },
  { num: "04", title: "Мастер приедет", desc: "Подтвердите заказ и ждите мастера" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Навбар */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-bold">
            home<span className="text-amber-400">fix</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Войти
            </Link>
            <Link
              href="/register"
              className="text-sm bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Начать
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-8">
          ✦ Проверенные мастера на дом
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Мастер на дом —<br />
          <span className="text-amber-400">быстро и надёжно</span>
        </h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10">
          Сантехника, электрика, ремонт и уборка. Только проверенные специалисты с реальными отзывами.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            Вызвать мастера
          </Link>
          <Link
            href="/services"
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            Смотреть услуги
          </Link>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20">
          <div>
            <p className="text-3xl font-bold text-amber-400">500+</p>
            <p className="text-zinc-500 text-sm mt-1">Мастеров</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400">10k+</p>
            <p className="text-zinc-500 text-sm mt-1">Заказов</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400">4.9★</p>
            <p className="text-zinc-500 text-sm mt-1">Рейтинг</p>
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Что мы делаем</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((s) => (
            <Link
              key={s.title}
              href="/services"
              className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h3 className="text-white font-semibold mb-1">{s.title}</h3>
              <p className="text-zinc-500 text-sm">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Как это работает */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="text-5xl font-bold text-zinc-800 mb-4">{step.num}</div>
              <h3 className="text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-zinc-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-amber-400 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">
            Готовы вызвать мастера?
          </h2>
          <p className="text-zinc-700 mb-8">
            Регистрация займёт меньше минуты
          </p>
          <Link
            href="/register"
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-3.5 rounded-xl transition-colors inline-block"
          >
            Зарегистрироваться
          </Link>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-zinc-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
          <span className="text-xl font-bold">
            home<span className="text-amber-400">fix</span>
          </span>
          <p className="text-zinc-600 text-sm">© 2026 homefix. Все права защищены.</p>
        </div>
      </footer>

    </div>
  );
}