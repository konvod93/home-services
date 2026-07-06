"use client";

import { useState } from "react";
import { updateMasterSettings } from "@/lib/actions/master.actions";

const categoryLabels: Record<string, string> = {
  PLUMBING: "🚿 Сантехніка",
  ELECTRICAL: "⚡ Електрика",
  RENOVATION: "🏠 Ремонт",
  CLEANING: "🧹 Прибирання",
  FURNITURE: "🪑 Меблі",
  OTHER: "🔧 Інше",
};

interface Service {
  id: string;
  name: string;
  category: string;
  unit: string;
  basePrice: number;
}

interface Props {
  master: {
    id: string;
    bio: string | null;
    city: string | null;
    district: string | null;
    subregion: string | null;
    region: string | null;
    phone: string | null;
    services: { serviceId: string; price: number }[];
  };
  allServices: Service[];
}

export default function MasterSettingsForm({ master, allServices }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    master.services.map((s) => s.serviceId)
  );

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    formData.append("serviceIds", JSON.stringify(selectedServices));
    const result = await updateMasterSettings(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  // Групуємо послуги по категоріях
  const grouped = allServices.reduce<Record<string, Service[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="masterId" value={master.id} />

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Про себе</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={master.bio ?? ""}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">
          Телефон <span className="text-red-400">*</span>
        </label>
        <input
          name="phone"
          type="tel"
          required
          defaultValue={master.phone ?? ""}
          placeholder="+380 00 000 00 00"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
        <p className="text-zinc-600 text-xs mt-1">Буде показано клієнту після оплати замовлення</p>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Область</label>
        <input name="region" type="text" defaultValue={master.region ?? ""} placeholder="Харківська"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Район області <span className="text-zinc-600">(необов’язково)</span></label>
        <input name="subregion" type="text" defaultValue={master.subregion ?? ""} placeholder="Чугуївський район"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Місто / Населений пункт</label>
        <input name="city" type="text" defaultValue={master.city ?? ""} placeholder="Харків"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Район міста <span className="text-zinc-600">(необов’язково)</span></label>
        <input name="district" type="text" defaultValue={master.district ?? ""} placeholder="Олексіївка"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors" />
      </div>

      {/* Послуги */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Мої послуги</label>
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, services]) => (
            <div key={category}>
              <p className="text-zinc-500 text-xs mb-2">{categoryLabels[category]}</p>
              <div className="space-y-1">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`w-full text-sm px-4 py-2.5 rounded-lg border transition-colors text-left flex items-center justify-between ${
                      selectedServices.includes(service.id)
                        ? "bg-amber-400/10 border-amber-400 text-white"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    <span>{service.name}</span>
                    <span className="text-zinc-600 text-xs">{service.unit}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">Збережено</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50"
      >
        {loading ? "Зберігаємо..." : "Зберегти"}
      </button>
    </form>
  );
}