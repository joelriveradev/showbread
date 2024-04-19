import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isElementAtBottom(element: HTMLElement): boolean {
  const scrollHeight = element.scrollHeight
  const offsetHeight = element.offsetHeight
  return element.scrollTop === scrollHeight - offsetHeight
}
