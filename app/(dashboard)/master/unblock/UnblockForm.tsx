"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { submitUnblockRequest } from "@/lib/actions/unblock.actions";

export default function UnblockForm({ masterId }: { masterId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { startUpload } = useUploadThing("masterDocuments");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    let documentUrls: string[] = [];
    if (files.length > 0) {
      const uploaded = await startUpload(files);
      if (!uploaded) {
        setError("Ошибка загрузки документов");
        setLoading(false);
        return;
      }
      documentUrls = uploaded.map((f) => f.url);
    }

    formData.append("masterId", masterId);
    formData.append("documents", JSON.stringify(documentUrls));

    const result = await submitUnblockRequest(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Объяснение ситуации <span className="text-red-400">*</span>
          </label>
          <textarea
            name="reason"
            rows={4}
            required
            placeholder="Опишите ситуацию и причины возникновения проблемы..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">
            Подтверждающие документы
            <span className="text-zinc-600 font-normal ml-1">(судебное решение, экспертная оценка)</span>
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-zinc-300 file:font-medium hover:file:bg-zinc-600 transition-colors"
          />
          {files.length > 0 && (
            <p className="text-zinc-500 text-xs mt-1">Выбрано: {files.length}</p>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50"
      >
        {loading ? "Отправляем..." : "Отправить заявку"}
      </button>
    </form>
  );
}