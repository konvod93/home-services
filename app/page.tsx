import Link from "next/link";

const services = [
  { emoji: "🚿", title: "Сантехніка", desc: "Заміна труб, змішувачів, усунення засмічень" },
  { emoji: "⚡", title: "Електрика", desc: "Розетки, люстри, щитки, проводка" },
  { emoji: "🏠", title: "Ремонт", desc: "Плитка, шпалери, шпаклівка, двері" },
  { emoji: "🧹", title: "Прибирання", desc: "Генеральне прибирання, після ремонту, миття вікон" },
  { emoji: "🪑", title: "Меблі", desc: "Збірка кухонь, шаф, ліжок" },
  { emoji: "🔧", title: "Інше", desc: "Будь-які роботи по дому під ключ" },
];

const steps = [
  { num: "01", title: "Оберіть послугу", desc: "Знайдіть потрібну послугу в каталозі" },
  { num: "02", title: "Оберіть майстра", desc: "Дивіться рейтинг, відгуки та ціни" },
  { num: "03", title: "Оберіть час", desc: "Оберіть зручний слот із доступних" },
  { num: "04", title: "Майстер приїде", desc: "Підтвердіть замовлення та чекайте майстра" },
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
              Увійти
            </Link>
            <Link
              href="/register"
              className="text-sm bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Почати
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-8">
          ✦ Перевірені майстри на дім
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Майстер на дім —<br />
          <span className="text-amber-400">швидко та надійно</span>
        </h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10">
          Сантехніка, електрика, ремонт та прибирання. Тільки перевірені спеціалісти з реальними відгуками.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            Викликати майстра
          </Link>
          <Link
            href="/services"
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            Переглянути послуги
          </Link>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20">
          <div>
            <p className="text-3xl font-bold text-amber-400">500+</p>
            <p className="text-zinc-500 text-sm mt-1">Майстрів</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400">10k+</p>
            <p className="text-zinc-500 text-sm mt-1">Замовлень</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-amber-400">4.9★</p>
            <p className="text-zinc-500 text-sm mt-1">Рейтинг</p>
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Що ми робимо</h2>
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
        <h2 className="text-3xl font-bold text-center mb-12">Як це працює</h2>
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
            Готові викликати майстра?
          </h2>
          <p className="text-zinc-700 mb-8">
            Реєстрація займе менше хвилини
          </p>
          <Link
            href="/register"
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-3.5 rounded-xl transition-colors inline-block"
          >
            Зареєструватися
          </Link>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-zinc-800 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
          <span className="text-xl font-bold">
            home<span className="text-amber-400">fix</span>
          </span>
          <p className="text-zinc-600 text-sm">© 2026 homefix. Всі права захищені.</p>
        </div>
      </footer>

    </div>
  );
}