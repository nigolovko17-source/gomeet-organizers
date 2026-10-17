function (g, _r, i, _a, _m, _e, _d) {
  "use strict";

  Object.defineProperty(_e, "__esModule", {
    value: !0
  }), _e.formatChatTime = p, _e.byFreshest = _, _e.formatMessageTime = function (e) {
    if (!e) return "";
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? "" : `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}`;
  }, _e.useEventChats = function () {
    const {
        userId: e
      } = (0, u.useAuth)(),
      s = (0, n.useInvalidate)(d.qk.eventChats(e)),
      {
        data: m,
        isPending: l
      } = (0, r.useQuery)({
        queryKey: d.qk.eventChats(e),
        queryFn: async () => {
          const s = await (0, o.getTicketEventIdsLocal)();
          let r = s;
          if (t.supabase && e) {
            const {
              data: a
            } = await t.supabase.from("orders").select("event_id").eq("user_id", e).eq("status", "paid");
            a?.length && (r = [...new Set([...s, ...a.map(e => e.event_id)])]);
          }
          if (!r.length) return [];
          const n = await (0, c.fetchEventsByIds)(r);
          if (!n.length) return [];
          const d = {};
          if (t.supabase) {
            const {
              data: e,
              error: s
            } = await t.supabase.rpc("event_chat_previews", {
              p_event_ids: n.map(e => e.id)
            });
            s && (0, a.captureError)(s, {
              where: "useEventChats",
              code: s.code
            });
            for (const t of e ?? []) d[t.event_id] = {
              body: t.body,
              created_at: t.created_at
            };
          }
          return n.map(e => ({
            id: e.id,
            type: "event",
            name: e.title,
            sub: e.place,
            preview: d[e.id]?.body ?? "Пока никто не писал",
            time: d[e.id] ? p(d[e.id].created_at) : "",
            ts: d[e.id] ? new Date(d[e.id].created_at).getTime() : 0,
            emoji: e.emoji,
            palette: e.palette
          }));
        }
      });
    return {
      chats: m ?? [],
      loading: l,
      reload: s
    };
  }, _e.useChatListLive = function (s) {
    const {
        userId: a
      } = (0, u.useAuth)(),
      r = (0, e.useRef)(s);
    r.current = s, (0, e.useEffect)(() => {
      if (!t.supabase || !a) return;
      const e = () => r.current(),
        s = t.supabase.channel(`chat-list-${a}`).on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "messages"
        }, e).on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "dm_messages"
        }, e).subscribe();
      return () => {
        s.unsubscribe();
      };
    }, [a]);
  }, _e.useDmChats = function () {
    const {
        userId: s
      } = (0, u.useAuth)(),
      [a, r] = (0, e.useState)([]),
      [n, d] = (0, e.useState)(!0),
      o = (0, e.useCallback)(async () => {
        if (!t.supabase || !s) return r([]), void d(!1);
        try {
          const {
            data: e,
            error: a
          } = await (0, t.withTimeout)(t.supabase.from("dm_messages").select("id, sender_id, recipient_id, body, created_at").or(`sender_id.eq.${s},recipient_id.eq.${s}`).order("created_at", {
            ascending: !1
          }).limit(300));
          if (a || !e) return r([]), void d(!1);
          const n = new Map();
          for (const t of e) {
            const e = t.sender_id === s ? t.recipient_id : t.sender_id;
            n.has(e) || n.set(e, t);
          }
          if (0 === n.size) return r([]), void d(!1);
          const {
              data: u
            } = await t.supabase.from("profiles").select("id, name, avatar_url").in("id", [...n.keys()]),
            o = new Map((u ?? []).map(e => [e.id, e.name ?? ""]));
          r([...n.entries()].map(([e, t]) => {
            const s = o.get(e) || "Без имени";
            return {
              id: e,
              type: "dm",
              name: s,
              initials: (0, m.initialsOf)(s),
              preview: t.body,
              time: p(t.created_at),
              ts: new Date(t.created_at).getTime()
            };
          }).sort(_));
        } catch {
          r([]);
        }
        d(!1);
      }, [s]);
    return (0, e.useEffect)(() => {
      o();
    }, [o]), {
      chats: a,
      loading: n,
      reload: o
    };
  }, _e.useDmMessages = function (a, r) {
    const [n, d] = (0, e.useState)([]),
      [u, o] = (0, e.useState)(!1);
    (0, e.useEffect)(() => {
      if (!t.supabase || !a || !r) return;
      let e = !0;
      t.supabase.from("dm_messages").select("id, sender_id, recipient_id, body, created_at").or(`and(sender_id.eq.${r},recipient_id.eq.${a}),and(sender_id.eq.${a},recipient_id.eq.${r})`).order("created_at", {
        ascending: !0
      }).limit(200).then(({
        data: t,
        error: s
      }) => {
        e && !s && t && d(t.map(e => b(e, r)));
      });
      const s = t.supabase.channel(`dm-${r}-${a}`).on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "dm_messages",
        filter: `recipient_id=eq.${r}`
      }, e => {
        const t = e.new;
        t.sender_id === a && d(e => e.some(e => e.id === t.id) ? e : [...e, b(t, r)]);
      }).subscribe(t => {
        e && o("SUBSCRIBED" === t);
      });
      return () => {
        e = !1, s.unsubscribe();
      };
    }, [a, r]);
    const c = (0, e.useCallback)(async e => {
      const n = e.trim();
      if (!n) return null;
      if (!t.supabase || !r) return "Войди, чтобы писать сообщения.";
      const u = (0, s.uuid)();
      d(e => [...e, {
        id: u,
        text: n,
        from: "me"
      }]);
      const {
        error: o
      } = await t.supabase.from("dm_messages").insert({
        id: u,
        sender_id: r,
        recipient_id: a,
        body: n
      });
      if (!o) return null;
      if (d(e => e.filter(e => e.id !== u)), (0, t.isRateLimited)(o)) return "Слишком часто. Подожди минуту и напиши снова.";
      return "PGRST205" === o.code || /schema cache/i.test(o.message) ? "Личные сообщения ещё не включены на сервере." : `\u041d\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u043b\u043e\u0441\u044c: ${o.message}`;
    }, [a, r]);
    return {
      messages: n,
      send: c,
      live: u
    };
  }, _e.useChatMessages = function (r, n, d) {
    const [u, o] = (0, e.useState)([]),
      [c, m] = (0, e.useState)(!1);
    (0, e.useEffect)(() => {
      if (!t.supabase || !r) return;
      let e = !0;
      t.supabase.from("messages").select("*").eq("event_id", r).order("created_at", {
        ascending: !0
      }).limit(200).then(({
        data: t,
        error: s
      }) => {
        e && !s && o(t.map(e => l(e, n)));
      });
      const s = t.supabase.channel(`event-chat-${r}`).on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `event_id=eq.${r}`
      }, e => {
        const t = e.new;
        o(e => e.some(e => e.id === t.id) ? e : [...e, l(t, n)]);
      }).subscribe(t => {
        e && m("SUBSCRIBED" === t);
      });
      return () => {
        e = !1, s.unsubscribe();
      };
    }, [r, n]);
    const f = (0, e.useCallback)(async e => {
      const u = e.trim();
      if (!u) return null;
      if (!t.supabase || !n) return o(e => [...e, {
        id: `local-${Date.now()}`,
        text: u,
        from: "me"
      }]), null;
      const c = (0, s.uuid)();
      o(e => [...e, {
        id: c,
        text: u,
        from: "me"
      }]);
      const {
        error: m
      } = await t.supabase.from("messages").insert({
        id: c,
        event_id: r,
        user_id: n,
        author: d,
        body: u,
        kind: "user"
      });
      return m ? (o(e => e.filter(e => e.id !== c)), (0, t.isRateLimited)(m) ? "Слишком часто. Подожди минуту и напиши снова." : "42501" === m.code || /row-level security/i.test(m.message) ? "Отметься «Иду» на событии, чтобы писать в чат." : ((0, a.captureError)(m, {
        where: "sendMessage",
        code: m.code,
        eventId: r
      }), "Не отправилось. Попробуйте ещё раз.")) : null;
    }, [r, n, d]);
    return {
      messages: u,
      send: f,
      live: c
    };
  };
  var e = _r(_d[0]),
    t = _r(_d[1]),
    s = _r(_d[2]),
    a = _r(_d[3]),
    r = _r(_d[4]),
    n = _r(_d[5]),
    d = _r(_d[6]),
    u = _r(_d[7]),
    o = _r(_d[8]),
    c = _r(_d[9]),
    m = _r(_d[10]);
  function l(e, t) {
    return {
      id: e.id,
      text: e.body,
      at: e.created_at,
      from: e.user_id && e.user_id === t ? "me" : "other",
      author: e.author ?? void 0,
      authorId: e.user_id ?? void 0,
      isSystem: "sys" === e.kind,
      isOrg: "org" === e.kind
    };
  }
  const f = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  function p(e) {
    const t = new Date(e);
    if (Number.isNaN(t.getTime())) return "";
    const s = new Date();
    if (t.toDateString() === s.toDateString()) return `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}`;
    const a = new Date(s.getFullYear(), s.getMonth(), s.getDate() - 1);
    return t.toDateString() === a.toDateString() ? "вчера" : `${t.getDate()} ${f[t.getMonth()]}`;
  }
  function _(e, t) {
    return (t.ts ?? 0) - (e.ts ?? 0);
  }
  const b = (e, t) => ({
    id: e.id,
    text: e.body,
    at: e.created_at,
    from: e.sender_id === t ? "me" : "other",
    authorId: e.sender_id
  });
}