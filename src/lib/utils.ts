import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseHotelInfo(infoString: string): { [key: string]: string } {
  const info: { [key: string]: string } = {};
  if (!infoString) return info;

  infoString.split(', ').forEach(part => {
    const [key, ...value] = part.split(': ');
    if (key && value.length > 0) {
      info[key.trim().toLowerCase().replace(/\s+/g, '')] = value.join(': ').trim();
    }
  });
  return info;
}
