export function uniqueConfirmations<T extends { event_title: string; student_id: string }>(rows: T[]): T[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = JSON.stringify([row.event_title.trim(), row.student_id.trim().toLowerCase()]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}