/**
 * Utility: Class Name Merging
 * 
 * Merges Tailwind and conditional classes safely.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
