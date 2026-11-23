export function formatWorkspaceDate(raw?: string | null): string {
  if (!raw) return 'Date unavailable';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function displayJourneyStatus(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Draft',
    IN_PROGRESS: 'In progress',
    ANALYZING: 'Processing',
    COMPLETED: 'Completed',
    FAILED: 'Needs attention',
    ARCHIVED: 'Archived',
  };
  return labels[status] || 'Status unavailable';
}

export function isResumableJourney(status: string): boolean {
  return status === 'DRAFT' || status === 'IN_PROGRESS';
}
