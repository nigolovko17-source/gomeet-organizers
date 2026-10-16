// D-032: the initial achievements release has no streak system or notifications.
// The organizers web data hook calls this predicate before synthesizing a row.
export function streakAtRisk() { return false; }
