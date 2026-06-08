"use client";

interface Props {
  data: string;
  signature: string;
}

export default function LiqpayButton({ data, signature }: Props) {
  return (
    <form method="POST" action="https://www.liqpay.ua/api/3/checkout" acceptCharset="utf-8">
      <input type="hidden" name="data" value={data} />
      <input type="hidden" name="signature" value={signature} />
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg py-2.5 transition-colors"
      >
        Оплатити через LiqPay
      </button>
    </form>
  );
}