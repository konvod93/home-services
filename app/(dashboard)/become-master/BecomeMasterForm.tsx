"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { submitMasterApplication } from "@/lib/actions/master-application.actions";

const categoryList = [
  { value: "PLUMBING", label: "🚿 Сантехника" },
  { value: "ELECTRICAL", label: "⚡ Электрика" },
  { value: "RENOVATION", label: "🏠 Ремонт" },
  { value: "CLEANING", label: "🧹 Уборка" },
  { value: "FURNITURE", label: "🪑 Мебель" },
  { value: "OTHER", label: "🔧 Другое" },
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
    // убираем услуги этой категории если категория снята
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
      setError("Выберите хотя бы одну категорию");
      setLoading(false);
      return;
    }

    if (selectedServices.length === 0) {
      setError("Выберите хотя бы одну услугу");
      setLoading(false);
      return;
    }

    if (!idPhotoFile) {
      setError("Загрузите фото с паспортом");
      setLoading(false);
      return;
    }

    const uploadedId = await uploadIdPhoto([idPhotoFile]);
    if (!uploadedId) {
      setError("Ошибка загрузки фото");
      setLoading(false);
      return;
    }

    let documentUrls: string[] = [];
    if (files.length > 0) {
      const uploaded = await uploadDocs(files);
      if (!uploaded) {
        setError("Ошибка загрузки документов");
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
      {/* Основная информация */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">О себе</label>
          <textarea
            name="bio"
            rows={3}
            required
            placeholder="Расскажите о своём опыте и специализации..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Опыт работы (лет)</label>
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
          <label className="block text-sm text-zinc-400 mb-1.5">Район міста <span className="text-zinc-600">(необов`язково)</span></label>
          <input
            name="district"
            type="text"
            placeholder="Олексіївка"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Шаг 1 — Категории */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Шаг 1: Выберите категории <span className="text-red-400">*</span>
        </label>
        <p className="text-zinc-500 text-xs mb-3">Отметьте направления в которых вы работаете</p>
        <div className="grid grid-cols-2 gap-2">
          {categoryList.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={`text-sm px-4 py-2.5 rounded-lg border transition-colors text-left ${selectedCategories.includes(cat.value)
                ? "bg-amber-400/10 border-amber-400 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Шаг 2 — Конкретные услуги */}
      {filteredServices.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-white mb-1">
            Шаг 2: Выберите услуги <span className="text-red-400">*</span>
          </label>
          <p className="text-zinc-500 text-xs mb-3">Отметьте только те работы которые вы умеете делать</p>
          <div className="space-y-1">
            {filteredServices.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`w-full text-sm px-4 py-2.5 rounded-lg border transition-colors text-left flex items-center justify-between ${selectedServices.includes(service.id)
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

      {/* Фото с паспортом */}
      <div className="bg-zinc-900 border border-amber-400/20 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Фото с паспортом <span className="text-red-400">*</span>
        </label>
        <p className="text-zinc-500 text-xs mb-3">
          Сфотографируйтесь рядом с развёрнутым паспортом. Лицо и данные паспорта должны быть чётко видны.
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

      {/* Документы */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Дипломы и сертификаты
          <span className="text-zinc-500 font-normal ml-1">(необязательно)</span>
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-zinc-300 file:font-medium hover:file:bg-zinc-600 transition-colors"
        />
        {files.length > 0 && (
          <p className="text-zinc-500 text-xs mt-2">Выбрано файлов: {files.length}</p>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Согласия */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-400 focus:ring-amber-400 focus:ring-offset-zinc-900"
          />
          <span className="text-sm text-zinc-400">
            Я согласен с{" "}
            <a href="/terms" target="_blank" className="text-amber-400 hover:text-amber-300 transition-colors">
              правилами сервиса
            </a>{" "}
            и обязуюсь выполнять работы качественно и в срок
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-400 focus:ring-amber-400 focus:ring-offset-zinc-900"
          />
          <span className="text-sm text-zinc-400">
            Я согласен на{" "}
            <a href="/privacy" target="_blank" className="text-amber-400 hover:text-amber-300 transition-colors">
              обработку персональных данных
            </a>
            , включая предоставленные документы и фото
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Отправляем заявку..." : "Подать заявку"}
      </button>
    </form>
  );
}