"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { submitMasterApplication } from "@/lib/actions/master-application.actions";

export default function BecomeMasterForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [idPhotoFile, setIdPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { startUpload: uploadDocs } = useUploadThing("masterDocuments");
  const { startUpload: uploadIdPhoto } = useUploadThing("idPhoto");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    if (!idPhotoFile) {
      setError("Загрузите фото с паспортом — это обязательно");
      setLoading(false);
      return;
    }

    // Загружаем фото с паспортом
    const uploadedId = await uploadIdPhoto([idPhotoFile]);
    if (!uploadedId) {
      setError("Ошибка загрузки фото");
      setLoading(false);
      return;
    }

    // Загружаем документы если есть
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
      </div>

      {/* Фото с паспортом — обязательно */}
      <div className="bg-zinc-900 border border-amber-400/20 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Фото с паспортом <span className="text-red-400">*</span>
        </label>
        <p className="text-zinc-500 text-xs mb-3">
          Сфотографируйтесь рядом с развёрнутым паспортом. Лицо и данные паспорта должны быть чётко видны. Фото используется только для верификации и не публикуется.
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

      {/* Дипломы и сертификаты — опционально */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <label className="block text-sm font-medium text-white mb-1">
          Дипломы и сертификаты
          <span className="text-zinc-500 font-normal ml-1">(необязательно)</span>
        </label>
        <p className="text-zinc-500 text-xs mb-3">
          PDF или фото дипломов, сертификатов, рекомендательных писем. До 5 файлов.
        </p>
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