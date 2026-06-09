import { NextRequest, NextResponse } from "next/server";
import { verifyLiqpaySignature, decodeLiqpayData } from "@/lib/liqpay";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = formData.get("data") as string;
  const signature = formData.get("signature") as string;

  if (!verifyLiqpaySignature(data, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = decodeLiqpayData(data);
  const { order_id, status } = payload;

  if (status === "hold_wait" || (status === "sandbox" && payload.action === "hold")) {
    await db.order.update({
      where: { id: order_id },
      data: {
        paymentStatus: "HELD",
        liqpayOrderId: String(payload.payment_id),
        heldAt: new Date(),
      },
    });
  }

  if (status === "success" || (status === "sandbox" && payload.action === "pay")) {
    await db.order.update({
      where: { id: order_id },
      data: { paymentStatus: "RELEASED" },
    });
  }

  if (status === "reversed") {
    await db.order.update({
      where: { id: order_id },
      data: { paymentStatus: "REFUNDED" },
    });
  }

  return NextResponse.json({ ok: true });
}