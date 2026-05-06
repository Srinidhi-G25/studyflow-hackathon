export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: any }

function toClassString(value: ClassValue): string {
  if (!value) return ""
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (Array.isArray(value)) return value.map(toClassString).filter(Boolean).join(" ")
  if (typeof value === "object")
    return Object.keys(value)
      .filter((k) => (value as any)[k])
      .join(" ")
  return ""
}

export function cn(...inputs: ClassValue[]) {
  return inputs.map(toClassString).filter(Boolean).join(" ")
}
