import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: string) {
  const date = new Date(timestamp);

  const options: {[key: string]: string} = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };

  return date.toLocaleDateString('en-US', options).replace(',', '.');
}