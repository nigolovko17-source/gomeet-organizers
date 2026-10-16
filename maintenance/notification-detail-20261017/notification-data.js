/** Adapter for the existing published hooks. No new query, RPC, permission or fixture. */
export function gmNotificationMetadata(row, item) {
  const p = row.payload || {};
  return { ...item, detail: {
    eventTitle: row.event?.title?.trim() || p.title?.trim() || undefined,
    quantity: Number.isSafeInteger(p.qty) && p.qty > 0 ? p.qty : undefined,
    amount: Number.isSafeInteger(p.total) && p.total >= 0 ? p.total : undefined,
    threadNo: Number.isSafeInteger(p.no) && p.no > 0 ? p.no : undefined,
    dueAt: typeof p.due_at === 'string' ? p.due_at : undefined,
    latePayment: p.late_payment === true,
  }};
}
export function gmTicketNotification(t) {
  return {
    id: `ticket-${t.id}`, kind: 'ticket', title: `Билет куплен: ${t.eventTitle}`,
    body: `${t.ticketName} × ${t.qty} · ${t.eventWhen}`, at: new Date(t.createdAt).getTime(),
    glyph: 'tag', eventId: t.eventId, orderId: t.id,
    detail: { eventTitle: t.eventTitle, eventWhen: t.eventWhen, eventPlace: t.eventPlace,
      ticketName: t.ticketName, quantity: t.qty },
  };
}
export function gmBadgeNotification(def, earnedAt) {
  return { id: `badge-${def.id}`, kind: 'badge', title: `Ты получил бейдж «${def.name}»`,
    body: def.description, at: new Date(earnedAt).getTime(), glyph: def.glyph, badgeId: def.id,
    detail: { badgeName: def.name } };
}
export function gmUseNotificationFeed(deps) {
  const { React, useFocusEffect, useAuth, useAchievements, useMyTickets, fetchServerNotifs, supabase } = deps;
  const { useState, useMemo, useCallback, useEffect, useRef } = React;
  const { userId } = useAuth();
  const { earned, loading: badgesLoading } = useAchievements();
  const { tickets, loading: ticketsLoading, reload: reloadTickets } = useMyTickets();
  const [server, setServer] = useState({ owner: userId, items: [], pending: !!userId, error: false });
  const generation = useRef(0);
  const channelId = useRef(Math.random().toString(36).slice(2));
  const refresh = useCallback(async () => {
    const seq = ++generation.current;
    if (!userId) { setServer({ owner: userId, items: [], pending: false, error: false }); return; }
    setServer(s => ({ owner: userId, items: s.owner === userId ? s.items : [], pending: true, error: false }));
    try {
      const items = await fetchServerNotifs(userId);
      if (generation.current === seq) setServer({ owner: userId, items, pending: false, error: false });
    } catch {
      if (generation.current === seq) setServer({ owner: userId, items: [], pending: false, error: true });
    }
  }, [userId]);
  useFocusEffect(useCallback(() => {
    void refresh();
    return () => { generation.current++; };
  }, [refresh]));
  useEffect(() => {
    if (!supabase || !userId) return;
    const channel = supabase.channel(`notifs-${userId}-${channelId.current}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, refresh)
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [userId, refresh]);
  const items = useMemo(() => {
    const result = server.owner === userId ? server.items.filter(n => n.kind !== 'streak') : [];
    for (const { def, earnedAt } of earned) {
      if (earnedAt && Number.isFinite(new Date(earnedAt).getTime())) result.push(gmBadgeNotification(def, earnedAt));
    }
    for (const ticket of tickets) result.push(gmTicketNotification(ticket));
    result.sort((a,b) => b.at-a.at);
    return result;
  }, [userId, server, earned, tickets]);
  return { items, risk: false, loading: !!(badgesLoading || ticketsLoading || (userId && (server.owner !== userId || server.pending))),
    error: server.owner === userId && server.error,
    reload: () => { reloadTickets?.(); void refresh(); } };
}
