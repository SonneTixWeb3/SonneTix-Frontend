import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx
 * Usage: cn('class1', 'class2', condition && 'class3')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format wallet address to display format (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number as IDR currency
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date and time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Calculate days until a date
 */
export function daysUntil(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if date is in the past
 */
export function isPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Generate random ID (for mock data)
 */
export function generateId(prefix: string): string {
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Sleep utility for simulating async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate ROI percentage
 */
export function calculateROI(investment: number, returns: number): number {
  if (investment === 0) return 0;
  return ((returns - investment) / investment) * 100;
}

/**
 * Calculate risk score based on various factors
 * Returns a score from 0-100 (higher is better/safer)
 */
export function calculateRiskScore(params: {
  organizerReputation: number;
  successRate: number;
  ltvRatio: number;
  daysUntilEvent: number;
}): number {
  const { organizerReputation, successRate, ltvRatio, daysUntilEvent } = params;

  // Weight factors
  const reputationWeight = 0.3;
  const successWeight = 0.3;
  const ltvWeight = 0.2;
  const timeWeight = 0.2;

  // Normalize values to 0-100 scale
  const reputationScore = Math.min(organizerReputation, 100);
  const successScore = successRate;
  const ltvScore = Math.max(0, 100 - (ltvRatio * 1.5)); // Lower LTV is better
  const timeScore = Math.min((daysUntilEvent / 90) * 100, 100); // More time is better

  const totalScore =
    reputationScore * reputationWeight +
    successScore * successWeight +
    ltvScore * ltvWeight +
    timeScore * timeWeight;

  return Math.round(totalScore);
}

/**
 * Get risk level label based on score
 */
export function getRiskLevel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) {
    return { label: 'Low Risk', color: 'text-green-700' };
  } else if (score >= 60) {
    return { label: 'Medium Risk', color: 'text-yellow-700' };
  } else if (score >= 40) {
    return { label: 'High Risk', color: 'text-orange-700' };
  } else {
    return { label: 'Very High Risk', color: 'text-red-700' };
  }
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
