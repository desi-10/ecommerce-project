import { Prisma } from "@/generated/prisma/client";

export const toNumber = (v: unknown) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : undefined;
};

export const toInt = (v: unknown) => {
  const n = toNumber(v);
  return n === undefined ? undefined : Math.trunc(n);
};

export const decimal = (n: number) => new Prisma.Decimal(n);
