import CryptoJS from "crypto-js";

const PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY!;
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY!;

export function createLiqpayData(params: Record<string, string | number>) {
  const data = Buffer.from(JSON.stringify(params)).toString("base64");
  const signature = CryptoJS.SHA1(PRIVATE_KEY + data + PRIVATE_KEY).toString(CryptoJS.enc.Base64);
  return { data, signature };
}

export function verifyLiqpaySignature(data: string, signature: string): boolean {
  const expected = CryptoJS.SHA1(PRIVATE_KEY + data + PRIVATE_KEY).toString(CryptoJS.enc.Base64);
  return expected === signature;
}

export function decodeLiqpayData(data: string): Record<string, string> {
  return JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
}

export function createPaymentParams(order: {
  id: string;
  totalPrice: number;
  description: string;
}) {
  return createLiqpayData({
    public_key: PUBLIC_KEY,
    version: "3",
    action: "hold",
    amount: order.totalPrice,
    currency: "UAH",
    description: order.description,
    order_id: order.id,
    result_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
    server_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/liqpay/webhook`,
    sandbox: "1",
  });
}