"use client";

import { useState } from "react";
import { createReview } from "@/lib/actions/review.actions";

export default function ReviewForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (rating === 0) {
      setError("Выберите оценку");
      return;
    }
    setLoading(true);
    setError(null);
    formData.append("rating", String(rating));
    formData.append("orderId", orderId);
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