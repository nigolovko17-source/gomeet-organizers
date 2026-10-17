module.exports = function (g, r, i, a, m, e, d) {
  "use strict";

  Object.defineProperty(e, '__esModule', {
    value: !0
  }), Object.defineProperty(e, "normalizeUsername", {
    enumerable: !0,
    get: function () {
      return u.normalizeUsername;
    }
  }), Object.defineProperty(e, "USERNAME_RULE", {
    enumerable: !0,
    get: function () {
      return u.USERNAME_RULE;
    }
  }), e.useEditableProfile = function (userId, mode = 'guest') {
    const identity = userId ? JSON.stringify([userId, mode]) : null;
    const [snapshot, setSnapshot] = n.useState({
      identity: null,
      status: 'idle',
      profile: p
    });
    const [attempt, setAttempt] = n.useState(0);
    const reload = n.useCallback(() => setAttempt(value => value + 1), []);
    n.useEffect(() => {
      let active = true;
      if (!userId) {
        setSnapshot({
          identity: null,
          status: 'idle',
          profile: p
        });
        return () => {
          active = false;
        };
      }
      const fail = error => {
        if (!active) return;
        setSnapshot({
          identity,
          status: 'failed',
          profile: p
        });
        try {
          o.captureError(error, {
            where: 'useEditableProfile',
            code: error?.code
          });
        } catch {}
      };
      if (!t.supabase) {
        fail(new Error('Profile service unavailable'));
        return () => {
          active = false;
        };
      }
      setSnapshot({
        identity,
        status: 'loading',
        profile: p
      });
      Promise.resolve().then(() => t.supabase.rpc('my_profile_for_mode', {
        p_mode: mode
      })).then(({
        data,
        error
      }) => {
        if (!active) return;
        if (error) {
          fail(error);
          return;
        }
        const row = Array.isArray(data) ? data[0] : data;
        const profile = row ? {
          name: row.name ?? '',
          username: row.username ?? '',
          avatarUrl: row.avatar_url,
          bio: row.bio ?? '',
          pinnedBadges: row.pinned_badges ?? null
        } : p;
        setSnapshot({
          identity,
          status: 'ready',
          profile
        });
      }).catch(fail);
      return () => {
        active = false;
      };
    }, [userId, mode, attempt]);
    const matches = snapshot.identity === identity;
    return {
      profile: matches && snapshot.status === 'ready' ? snapshot.profile : p,
      loading: !!userId && (!matches || snapshot.status === 'loading' || snapshot.status === 'idle'),
      failed: !!userId && matches && snapshot.status === 'failed',
      ready: !!userId && matches && snapshot.status === 'ready',
      reload
    };
  }, e.saveMyProfile = async function (n) {
    if (!t.supabase) return {
      ok: !1,
      error: '\u041d\u0435\u0442 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0431\u0430\u0437\u043e\u0439. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435.'
    };
    const p = n.name.trim();
    if (p.length < 2 || p.length > 80) return {
      ok: !1,
      field: 'name',
      error: '\u0418\u043c\u044f \u2014 \u043e\u0442 2 \u0434\u043e 80 \u0437\u043d\u0430\u043a\u043e\u0432.'
    };
    if ((n.bio?.length ?? 0) > 160 || (n.pinnedBadges?.length ?? 0) > 3 || n.pinnedBadges && new Set(n.pinnedBadges).size !== n.pinnedBadges.length) return {
      ok: !1,
      error: '\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u2014 \u0434\u043e 160 \u0437\u043d\u0430\u043a\u043e\u0432, \u043d\u0430\u0433\u0440\u0430\u0434 \u2014 \u043d\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u0442\u0440\u0451\u0445 \u0431\u0435\u0437 \u043f\u043e\u0432\u0442\u043e\u0440\u043e\u0432.'
    };
    const c = (0, u.normalizeUsername)(n.username);
    if (!u.USERNAME_RULE.test(c)) return {
      ok: !1,
      field: 'username',
      error: '\u041d\u0438\u043a\u043d\u0435\u0439\u043c \u2014 \u043b\u0430\u0442\u0438\u043d\u0438\u0446\u0430, \u0446\u0438\u0444\u0440\u044b \u0438 \u043f\u043e\u0434\u0447\u0451\u0440\u043a\u0438\u0432\u0430\u043d\u0438\u0435, \u043e\u0442 2 \u0434\u043e 30 \u0437\u043d\u0430\u043a\u043e\u0432.'
    };
    const _ = void 0 !== n.bio || 'org' === n.mode;
    try {
      const {
        data: u,
        error: f
      } = await t.supabase.rpc(_ ? 'update_my_mode_profile' : 'update_my_profile', Object.assign({}, _ ? {
        p_mode: n.mode ?? 'guest'
      } : {}, {
        p_expected_user: n.userId,
        p_name: p,
        p_username: c,
        p_avatar_url: n.avatarUrl,
        p_categories: (0, l.normalizeInterests)(n.interests)
      }, _ ? {
        p_bio: n.bio ?? '',
        p_pinned_badges: n.pinnedBadges ?? null
      } : {}));
      return f ? '23505' === f.code ? {
        ok: !1,
        field: 'username',
        error: '\u042d\u0442\u043e\u0442 \u043d\u0438\u043a\u043d\u0435\u0439\u043c \u0443\u0436\u0435 \u0437\u0430\u043d\u044f\u0442. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043e\u0439.'
      } : '23514' === f.code ? {
        ok: !1,
        field: 'username',
        error: '\u041d\u0438\u043a\u043d\u0435\u0439\u043c \u2014 \u043b\u0430\u0442\u0438\u043d\u0438\u0446\u0430, \u0446\u0438\u0444\u0440\u044b \u0438 \u043f\u043e\u0434\u0447\u0451\u0440\u043a\u0438\u0432\u0430\u043d\u0438\u0435, \u043e\u0442 2 \u0434\u043e 30 \u0437\u043d\u0430\u043a\u043e\u0432.'
      } : ((0, o.captureError)(f, {
        where: 'saveMyProfile',
        code: f.code
      }), {
        ok: !1,
        error: '\u041d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0432\u044f\u0437\u044c \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.'
      }) : u?.user_id === n.userId && Array.isArray(u?.interests) ? void 0 === n.bio || u.bio === n.bio.trim() && JSON.stringify(u.pinned_badges) === JSON.stringify(n.pinnedBadges ?? null) ? (await s.queryClient.invalidateQueries(), {
        ok: !0
      }) : {
        ok: !1,
        error: '\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0438 \u043d\u0430\u0433\u0440\u0430\u0434\u044b \u043d\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0441\u044c. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.'
      } : {
        ok: !1,
        error: '\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043d\u0435 \u0438\u0437\u043c\u0435\u043d\u0451\u043d. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u0438 \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435.'
      };
    } catch {
      return {
        ok: !1,
        error: '\u041d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0432\u044f\u0437\u044c \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.'
      };
    }
  };
  var n = r(d[0]),
    t = r(d[1]),
    o = r(d[2]),
    s = r(d[3]),
    u = r(d[4]),
    l = r(d[5]);
  const p = {
    name: '',
    username: '',
    avatarUrl: null
  };
};
