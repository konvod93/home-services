"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { createReview } from "@/lib/actions/review.actions";

export default function ReviewForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { startUpload } = useUploadThing("reviewPhotos");

  async function handleSubmit(formData: FormData) {
    if (rating === 0) {
      setError("Выберите оценку");
      return;
    }
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

    formData.append("rating", String(rating));
    formData.append("orderId", orderId);
    formData.append("photos", JSON.stringify(photoUrls));

    const result = await createReview(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Звёзды */}
      <div>
        <label className="block text-sm text-zinc-400 mb-3">Оценка</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl transition-transform hover:scale-110"
            >
              <span className={star <= (hovered || rating) ? "text-amber-400" : "text-zinc-700"}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Комментарий */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Комментарий</label>
        <textarea
          name="comment"
          rows={4}
          placeholder="Расскажите о работе мастера..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      {/* Фото */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">
          Фото <span className="text-zinc-600">(необязательно, до 5 штук)</span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-zinc-300 file:font-medium hover:file:bg-zinc-600 transition-colors"
        />
        {files.length > 0 && (
          <p className="text-zinc-500 text-xs mt-1">Выбрано: {files.length}</p>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Отправляем..." : "Отправить отзыв"}
      </button>
    </form>
  );
}