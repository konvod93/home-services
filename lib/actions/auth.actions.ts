"use server";

import { db } from "@/lib/db";
import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const turnstileToken = formData.get("turnstileToken") as string;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;

  if (!name || !email || !password) {
    return { error: "Заполните все поля" };
  }

  const valid = await verifyTurnstile(turnstileToken);
  if (!valid) {
    return { error: "Проверка капчи не пройдена" };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Пользователь с таким email уже существует" };
  }

  const hashed = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      password: hashed,
      region: region || null,
      city: city || null,
      district: district || null,
    },
  });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Неверный email или пароль" };
    }
    throw error;
  }
}