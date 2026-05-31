"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { submitComplaint } from "@/lib/actions/complaint.actions";

export default function ComplaintForm({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { startUpload } = useUploadThing("reviewPhotos");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    let photoUrls: string[] = [];
    if (files.length > 0) {
      const uploaded = await startUpload(files);
      if (!uploaded) {
        setError("Ошибка загрузки фото");
        setLoading(false);
        return;
      }
      photoUrls = uploaded.map((f) => f.url);
    }

    formData.append("photos", JSON.stringify(photoUrls));
    const result = await submitComplaint(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setOpen(false);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <p className="text-zinc-500 text-sm text-center mt-4">
        ✓ Жалоба подана — мы рассмотрим её в ближайшее время
      </p>
    );
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-zinc-600 hover:text-red-400 transition-colors w-full text-center"
        >
          Пожаловаться на мастера
        </button>
      ) : (
        <form action={handleSubmit} className="space-y-3">
          <input type="hidden" name="orderId" value={orderId} />
          <textarea
            name="reason"
            rows={3}
            required
            placeholder="Опишите проблему..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-400 transition-colors resize-none"
          />
          <div>
            <label className="block text-sm text-zinc-500 mb-1.5">
              Фото как доказательство <span className="text-zinc-600">(необязательно)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-zinc-300 file:font-medium hover:file:bg-zinc-600 transition-colors"
            />
            {files.length > 0 && (
              <p className="text-zinc-600 text-xs mt-1">Выбрано: {files.length}</p>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-400 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Отправляем..." : "Отправить жалобу"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-zinc-500 hover:text-white text-sm px-4 py-2 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}