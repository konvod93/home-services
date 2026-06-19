"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { submitMasterApplication } from "@/lib/actions/master-application.actions";

const categoryList = [
  { value: "PLUMBING", label: "🚿 Сантехніка" },
  { value: "ELECTRICAL", label: "⚡ Електрика" },
  { value: "RENOVATION", label: "🏠 Ремонт" },
  { value: "CLEANING", label: "🧹 Прибирання" },
  { value: "FURNITURE", label: "🪑 Меблі" },
  { value: "OTHER", label: "🔧 Інше" },
];

interface Service {
  id: string;
  name: string;
  category: string;
  unit: string;
}

interface Props {
  services: Service[];
}

export default function BecomeMasterForm({ services }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [idPhotoFile, setIdPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { startUpload: uploadDocs } = useUploadThing("masterDocuments");
  const { startUpload: uploadIdPhoto } = useUploadThing("idPhoto");

  function toggleCategory(value: string) {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
    if (selectedCategories.includes(value)) {
      const categoryServices = services.filter((s) => s.category === value).map((s) => s.id);
      setSelectedServices((prev) => prev.filter((id) => !categoryServices.includes(id)));
    }
  }

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const filteredServices = services.filter((s) => selectedCategories.includes(s.category));

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    if (selectedCategories.length === 0) {
      setError("Оберіть хоча б одну категорію");
      setLoading(false);
      return;
    }

    if (selectedServices.length === 0) {
      setError("Оберіть хоча б одну послугу");
      setLoading(false);
      return;
    }

    if (!idPhotoFile) {
      setError("Завантажте фото з паспортом");
      setLoading(false);
      return;
    }

    const uploadedId = await uploadIdPhoto([idPhotoFile]);
    if (!uploadedId) {
      setError("Помилка завантаження фото");
      setLoading(false);
      return;
    }

    let documentUrls: string[] = [];
    if (files.length > 0) {
      const uploaded = await uploadDocs(files);
      if (!uploaded) {
        setError("Помилка завантаження документів");
        setLoading(false);
        return;
      }
      documentUrls = uploaded.map((f) => f.url);
    }

    formData.append("documents", JSON.stringify(documentUrls));
    formData.append("idPhoto", uploadedId[0].url);
    formData.append("categories", JSON.stringify(selectedCategories));
    formData.append("serviceIds", JSON.stringify(selectedServices));

    const result = await submitMasterApplication(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Основна інформація */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Про себе</label>
          <textarea
            name="bio"
            rows={3}
            required
            placeholder="Розкажіть про свій досвід та спеціалізацію..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Досвід роботи (років)</label>
          <input
            name="experience"
            type="number"
            min="0"
            max="50"
            required
            placeholder="5"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Область</label>
          <input
            name="region"
            type="text"
            required
            placeholder="Харківська"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Місто / Населений пункт</label>
          <input
            name="city"
            type="text"
            required
            placeholder="Харків"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Район міста <span className="text-zinc-600">(необов’язково)</span>
          </label>
          <input
            name="district"
            type="text"
            placeholder="Олексіївка"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Крок 1 — Категорії */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Крок 1: Оберіть категорії <span className="text-red-400">*</span>
        </label>
        <p className="text-zinc-500 text-xs mb-3">Відмітьте напрямки в яких ви працюєте</p>
        <div className="grid grid-cols-2 gap-2">
          {categoryList.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={`text-sm px-4 py-2.5 rounded-lg border transition-colors text-left ${
                selectedCategories.includes(cat.value)
                  ? "bg-amber-400/10 border-amber-400 text-amber-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Крок 2 — Послуги */}
      {filteredServices.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-white mb-1">
            Крок 2: Оберіть послуги <span className="text-red-400">*</span>
          </label>
          <p className="text-zinc-500 text-xs mb-3">Відмітьте лише ті роботи які ви вмієте виконувати</p>
          <div className="space-y-1">
            {filteredServices.map((service) => (
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
      )}

      {/* Фото з паспортом */}
      <div className="bg-zinc-900 border border-amber-400/20 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Фото з паспортом <span className="text-red-400">*</span>
        </label>
        <p className="text-zinc-500 text-xs mb-3">
          Сфотографуйтеся поряд з розгорнутим паспортом. Обличчя та дані паспорта мають бути чітко видні. Фото використовується лише для верифікації.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIdPhotoFile(e.target.files?.[0] || null)}
          className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-400 file:text-zinc-900 file:font-medium hover:file:bg-amber-300 transition-colors"
        />
        {idPhotoFile && (
          <p className="text-green-400 text-xs mt-2">✓ {idPhotoFile.name}</p>
        )}
      </div>

      {/* Документи */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Дипломи та сертифікати
          <span className="text-zinc-500 font-normal ml-1">(необов’язково)</span>
        </label>
        <p className="text-zinc-500 text-xs mb-3">
          PDF або фото дипломів, сертифікатів, рекомендаційних листів. До 5 файлів.
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-zinc-300 file:font-medium hover:file:bg-zinc-600 transition-colors"
        />
        {files.length > 0 && (
          <p className="text-zinc-500 text-xs mt-2">Вибрано файлів: {files.length}</p>
        )}
      </div>

      {/* Згоди */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-amber-400"
          />
          <span className="text-sm text-zinc-400">
            Я погоджуюся з{" "}
            <a href="/terms" target="_blank" className="text-amber-400 hover:text-amber-300 transition-colors">
              правилами сервісу
            </a>{" "}
            та зобов’язуюся виконувати роботи якісно та вчасно
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-amber-400"
          />
          <span className="text-sm text-zinc-400">
            Я погоджуюся на{" "}
            <a href="/privacy" target="_blank" className="text-amber-400 hover:text-amber-300 transition-colors">
              обробку персональних даних
            </a>
            , включаючи надані документи та фото
          </span>
        </label>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Надсилаємо заявку..." : "Подати заявку"}
      </button>
    </form>
  );
}