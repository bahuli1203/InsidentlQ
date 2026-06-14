import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function severityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: "text-red-400 bg-red-400/10 border-red-400/20",
    high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    low: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };
  return colors[severity] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-red-400 bg-red-400/10 border-red-400/20",
    investigating: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    mitigating: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    resolved: "text-green-400 bg-green-400/10 border-green-400/20",
    postmortem: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return colors[status] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}
