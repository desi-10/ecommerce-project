// validators/products.utils.ts  ✅ safe for frontend + backend
export const toNumber = (v: unknown) => {
  if (v === "" || v === null || v === undefined) return undefined;

  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;

  if (typeof v === "string") {
    const trimmed = v.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
  }

  return undefined;
};

export const toInt = (v: unknown) => {
  const n = toNumber(v);
  return n === undefined ? undefined : Math.trunc(n);
};
