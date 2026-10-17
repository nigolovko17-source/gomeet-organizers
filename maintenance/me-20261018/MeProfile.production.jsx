module.exports = function (g, r, i, a, m, _e, d) {
  "use strict";

  function e(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }
  Object.defineProperty(_e, '__esModule', {
    value: !0
  }), Object.defineProperty(_e, "default", {
    enumerable: !0,
    get: function () {
      return W;
    }
  }), _e.ProfileTabs = _, _e.ProfileEvent = V;
  var t = r(d[0]),
    n = e(r(d[1])),
    s = e(r(d[2])),
    l = e(r(d[3])),
    o = e(r(d[4])),
    c = e(r(d[5])),
    u = e(r(d[6])),
    f = e(r(d[7])),
    b = r(d[8]),
    h = r(d[9]),
    x = r(d[10]),
    p = e(r(d[11])),
    y = e(r(d[12])),
    j = e(r(d[13])),
    v = e(r(d[14])),
    w = e(r(d[15])),
    C = r(d[16]),
    D = r(d[17]),
    P = r(d[18]),
    R = r(d[19]),
    E = r(d[20]),
    I = r(d[21]),
    S = r(d[22]),
    L = r(d[23]),
    z = r(d[24]),
    H = r(d[25]),
    k = r(d[26]),
    A = r(d[27]),
    F = r(d[28]),
    B = r(d[29]);
  const O = ['\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435', '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435', '\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435'],
    T = ['\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435', '\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435'];
  function W({
    profile: e,
    loading: s,
    counts: l,
    onSettings: u
  }) {
    const h = (0, t.useRef)(null),
      x = (0, b.useNavigation)(),
      {
        userId: w
      } = (0, P.useAuth)(),
      [E, F] = (0, t.useState)('\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435'),
      {
        mode: W
      } = (0, R.useMode)(),
      $ = 'org' === W && '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435' === E ? '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' : E,
      G = 'org' === W ? T : O,
      X = (0, k.useOrganizerProfileEvents)(w, 'org' === W);
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      'org' === W && X.refetch();
    }, [W, X.refetch]));
    const q = 'org' === W ? 'organizer' : 'guest',
      J = (0, k.useConductedEventCount)(w, 'org' === W);
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      'org' === W && J.refetch();
    }, [W, J.refetch]));
    const {
        stats: K,
        earned: Q,
        primaryBadge: Y,
        loading: Z
      } = (0, I.useAchievements)(q),
      ee = (0, S.useRewardBadges)(!0),
      te = (0, L.mergeProfileBadges)(Q, ee.isError ? [] : ee.data ?? [], q),
      ae = (0, A.useUpcomingProfileEvents)('org' !== W && '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $),
      ie = (0, z.useSavedEvents)('org' !== W && '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435' === $),
      ne = (0, H.useAttendedEvents)('org' !== W && '\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435' === $),
      re = ae.reload;
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      'org' !== W && '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ && re();
    }, [W, $, re]));
    const se = 'org' === W ? {
        events: X.data?.['\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435' === $ ? 'past' : 'upcoming'] ?? [],
        loading: X.isPending,
        failed: X.isError,
        reload: X.refetch
      } : '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ ? ae : '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435' === $ ? ie : ne,
      le = [Y, ...te.map(e => e.def).filter(e => e.id !== Y?.id)].filter(e => !!e).slice(0, 3),
      oe = e.pinnedBadges?.map(e => te.find(t => t.def.id === e)?.def).filter(e => !!e).slice(0, 3),
      de = 0 === e.pinnedBadges?.length ? [] : oe?.length ? oe : le,
      ce = te.slice(0, 6),
      ue = () => x.navigate('Trophies', {
        audience: q
      });
    if(W!=='org')return t.createElement(MeBody,{profile:e,loading:s,counts:l,mode:W,selected:$,tabs:G,onSelect:F,events:se,stats:K,conducted:J.data??0,navigation:x,featuredBadges:de,onSettings:()=>u()});
return (0, B.jsxs)(B.Fragment, {
      children: [(0, B.jsx)(j.default, {
        compact: !0,
        profile: e,
        loading: s,
        onEdit: () => x.navigate('EditProfile'),
        featured: de,
        onBadge: ue,
        toolbar: (0, B.jsxs)(B.Fragment, {
          children: [(0, B.jsx)(N, {
            icon: "bell",
            label: "\u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f",
            onPress: () => x.navigate('Notifications')
          }), (0, B.jsx)(f.default, {
            style: {
              flex: 1
            }
          }), (0, B.jsx)(f.default, {
            ref: h,
            collapsable: !1,
            children: (0, B.jsx)(N, {
              icon: "settings",
              label: "\u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u043f\u0440\u043e\u0444\u0438\u043b\u044f",
              onPress: () => {
                h.current?.measureInWindow((e, t, n, s) => u({
                  x: e,
                  y: t,
                  width: n,
                  height: s
                }));
              }
            })
          })]
        })
      }), (0, B.jsxs)(f.default, {
        style: U.stats,
        children: [(0, B.jsx)(M, {
          value: 'org' === W ? J.data ?? 0 : K.attended,
          label: 'org' === W ? '\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u043f\u0440\u043e\u0432\u0451\u043b' : '\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u043f\u043e\u0441\u0435\u0442\u0438\u043b',
          onPress: () => F('\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435')
        }), (0, B.jsx)(M, {
          value: l.followers,
          label: "\u041f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u0438"
        }), 'org' !== W && (0, B.jsx)(M, {
          value: l.following,
          label: "\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0438"
        })]
      }), (0, B.jsx)(_, {
        items: G,
        selected: $,
        onSelect: F
      }), 'org' !== W && '\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435' === $ && (0, B.jsx)(p.default, {
        variant: "caption",
        style: U.note,
        children: "\u041f\u043e\u0441\u0435\u0449\u0435\u043d\u0438\u044f, \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043d\u043d\u044b\u0435 \u0431\u0438\u043b\u0435\u0442\u043e\u043c \u043d\u0430 \u0432\u0445\u043e\u0434\u0435"
      }), se.loading ? (0, B.jsx)(n.default, {
        color: D.DesignColors.text,
        style: {
          padding: 32
        }
      }) : ('org' === W ? X.isError : '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ && ae.failed) ? (0, B.jsxs)(f.default, {
        style: U.empty,
        children: [(0, B.jsx)(p.default, {
          children: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u043e\u0431\u044b\u0442\u0438\u044f"
        }), (0, B.jsx)(y.default, {
          label: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
          onPress: () => {
            'org' === W ? X.refetch() : ae.reload();
          }
        })]
      }) : se.events.length ? (0, B.jsx)(f.default, {
        style: U.grid,
        children: se.events.map((e, t) => (0, B.jsx)(V, {
          event: e,
          wide: t % 3 == 2,
          onPress: () => x.navigate('org' === W && '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ ? 'OrgEventDetail' : 'EventDetail', {
            eventId: e.id
          })
        }, e.id))
      }) : (0, B.jsxs)(f.default, {
        style: U.empty,
        children: [(0, B.jsx)(C.Icon, {
          name: '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435' === $ ? 'heart' : 'ticket',
          size: 24,
          color: D.DesignColors.textSecondary
        }), (0, B.jsx)(p.default, {
          variant: "label",
          children: 'org' === W ? '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ ? '\u0410\u043d\u043e\u043d\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442' : '\u041f\u0440\u043e\u0432\u0435\u0434\u0451\u043d\u043d\u044b\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442' : '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ ? '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442' : '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435' === $ ? '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u0435 \u0442\u043e, \u0447\u0442\u043e \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e' : '\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0432\u0430\u0448\u0438 \u043f\u043e\u0441\u0435\u0449\u0435\u043d\u0438\u044f'
        }), (0, B.jsx)(p.default, {
          variant: "caption",
          style: U.note,
          children: 'org' === W ? '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ ? '\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0432\u0430\u0448\u0438 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0441\u043e\u0431\u044b\u0442\u0438\u044f.' : '\u041f\u043e\u0441\u043b\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0438\u044f \u0441\u043e\u0431\u044b\u0442\u0438\u044f \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.' : '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === $ ? '\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u0441 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u043c\u0438 \u0431\u0438\u043b\u0435\u0442\u0430\u043c\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c.' : '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435' === $ ? '\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u0441\u0435\u0440\u0434\u0446\u0435 \u043d\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u0438 \u2014 \u043e\u043d\u043e \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0432 \u044d\u0442\u043e\u0439 \u0432\u043a\u043b\u0430\u0434\u043a\u0435.' : '\u041f\u043e\u0441\u0435\u0449\u0435\u043d\u0438\u0435 \u0437\u0430\u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0441\u043a\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0431\u0438\u043b\u0435\u0442\u0430.'
        }), (0, B.jsx)(y.default, {
          label: 'org' === W ? '\u041c\u043e\u0438 \u0441\u043e\u0431\u044b\u0442\u0438\u044f' : '\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0430\u0444\u0438\u0448\u0443',
          onPress: () => x.navigate('Tabs', {
            screen: 'org' === W ? 'OrgEvents' : 'Home'
          })
        })]
      }), (0, B.jsxs)(f.default, {
        style: U.awards,
        children: [(0, B.jsxs)(f.default, {
          style: U.awardsHead,
          children: [(0, B.jsx)(p.default, {
            variant: "label",
            style: {
              flex: 1
            },
            children: "\u0422\u0440\u043e\u0444\u0435\u0438"
          }), (0, B.jsx)(o.default, {
            onPress: ue,
            accessibilityRole: "button",
            accessibilityLabel: "\u0432\u0441\u0435 \u0442\u0440\u043e\u0444\u0435\u0438",
            style: U.all,
            children: (0, B.jsx)(p.default, {
              variant: "caption",
              children: "\u0412\u0441\u0435 \u0442\u0440\u043e\u0444\u0435\u0438 \u203a"
            })
          })]
        }), ee.isLoading && (0, B.jsx)(n.default, {
          accessibilityLabel: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u043d\u043e\u0432\u044b\u0445 \u0442\u0440\u043e\u0444\u0435\u0435\u0432"
        }), ee.isError && (0, B.jsxs)(B.Fragment, {
          children: [(0, B.jsx)(p.default, {
            accessibilityRole: "alert",
            children: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0442\u0440\u043e\u0444\u0435\u0438 \u043d\u043e\u0432\u043e\u0439 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b."
          }), (0, B.jsx)(y.default, {
            label: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0443 \u0442\u0440\u043e\u0444\u0435\u0435\u0432",
            variant: "secondary",
            loading: ee.isFetching,
            onPress: () => {
              ee.refetch();
            }
          })]
        }), (0, B.jsxs)(c.default, {
          horizontal: !0,
          showsHorizontalScrollIndicator: !1,
          contentContainerStyle: {
            gap: 16
          },
          children: [!Z && !ee.isLoading && !ee.isError && 0 === ce.length && (0, B.jsx)(p.default, {
            variant: "caption",
            style: U.note,
            children: "\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043d\u044b\u0435 \u0437\u043d\u0430\u0447\u043a\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c."
          }), ce.map(({
            def: e
          }) => (0, B.jsxs)(o.default, {
            onPress: ue,
            accessibilityRole: "button",
            accessibilityLabel: e.name,
            style: U.award,
            children: [(0, B.jsx)(v.default, {
              design: "2026",
              def: e,
              size: 52
            }), (0, B.jsx)(p.default, {
              variant: "caption",
              style: U.awardName,
              children: e.name
            }), (0, B.jsx)(p.default, {
              variant: "caption",
              style: U.awardName,
              children: e.id.startsWith('reward_') ? '\u041d\u043e\u0432\u0430\u044f \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430' : '\u041f\u0440\u0435\u0436\u043d\u044f\u044f \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430'
            })]
          }, e.id))]
        })]
      }), (0, B.jsx)(y.default, {
        label: "\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434\u044b",
        variant: "secondary",
        onPress: () => x.navigate('RewardWallet')
      })]
    });
  }
  function _({
    items: e,
    selected: n,
    onSelect: c
  }) {
    const [u, b] = (0, t.useState)(0),
      h = (0, t.useRef)(new s.default.Value(0)).current,
      x = (0, t.useRef)(0),
      y = (0, E.useReduceMotion)(),
      j = Math.max(0, (u - 6) / e.length);
    return (0, t.useEffect)(() => {
      const t = e.indexOf(n) * j;
      return h.stopAnimation(), x.current !== u || y ? h.setValue(t) : s.default.timing(h, {
        toValue: t,
        duration: (0, E.motionDuration)(240, y),
        easing: l.default.out(l.default.cubic),
        useNativeDriver: !0
      }).start(), x.current = u, () => h.stopAnimation();
    }, [n, j, u, y, h, e]), (0, B.jsxs)(f.default, {
      style: U.tabs,
      accessibilityRole: "tablist",
      accessibilityLabel: "\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u0432 \u043f\u0440\u043e\u0444\u0438\u043b\u0435",
      onLayout: e => b(e.nativeEvent.layout.width),
      children: [u > 0 && (0, B.jsx)(s.default.View, {
        pointerEvents: "none",
        "aria-hidden": !0,
        testID: "profile-tab-indicator",
        style: [U.tabIndicator, {
          width: j,
          transform: [{
            translateX: h
          }]
        }]
      }), e.map(e => (0, B.jsx)(o.default, {
        onPress: () => c(e),
        accessibilityRole: "tab",
        accessibilityState: {
          selected: e === n
        },
        "aria-selected": e === n,
        accessibilityLabel: e,
        style: U.tab,
        children: (0, B.jsx)(p.default, {
          variant: "caption",
          style: {
            color: e === n ? D.DesignColors.onActionPrimary : D.DesignColors.text,
            textAlign: 'center'
          },
          children: e
        })
      }, e))]
    });
  }
  function N({
    icon: e,
    label: t,
    onPress: n
  }) {
    return (0, B.jsx)(o.default, {
      onPress: n,
      accessibilityRole: "button",
      accessibilityLabel: t,
      style: U.round,
      children: (0, B.jsx)(h.Feather, {
        name: e,
        size: 20,
        color: D.DesignColors.text
      })
    });
  }
  function M({
    value: e,
    label: t,
    onPress: n
  }) {
    const s = (0, B.jsxs)(B.Fragment, {
      children: [(0, B.jsx)(p.default, {
        variant: "sectionTitle",
        children: e
      }), (0, B.jsx)(p.default, {
        variant: "caption",
        style: U.statLabel,
        children: t
      })]
    });
    return n ? (0, B.jsx)(o.default, {
      onPress: n,
      accessibilityRole: "button",
      accessibilityLabel: `${t}: ${e}`,
      style: U.stat,
      children: s
    }) : (0, B.jsx)(f.default, {
      accessibilityLabel: `${t}: ${e}`,
      style: U.stat,
      children: s
    });
  }
  function V({
    event: e,
    wide: t,
    onPress: n
  }) {
    return (0, B.jsxs)(o.default, {
      onPress: n,
      accessibilityRole: "button",
      accessibilityLabel: e.title,
      style: [U.event, t && U.wide],
      children: [(0, B.jsx)(f.default, {
        style: u.default.absoluteFill,
        children: (0, B.jsx)(w.default, {
          design: "2026",
          palette: e.palette,
          imageUri: e.imageUri,
          image: (0, F.eventImage)(e),
          height: 188
        })
      }), (0, B.jsx)(x.LinearGradient, {
        colors: ['rgba(10,10,10,0.3)', 'rgba(10,10,10,0.15)', 'rgba(10,10,10,0.96)'],
        style: u.default.absoluteFill
      }), (0, B.jsxs)(f.default, {
        style: U.date,
        children: [(0, B.jsx)(p.default, {
          variant: "sectionTitle",
          children: e.num
        }), (0, B.jsx)(p.default, {
          variant: "caption",
          children: e.month?.slice(0, 3).toUpperCase()
        })]
      }), (0, B.jsxs)(f.default, {
        style: U.eventBody,
        children: [(0, B.jsx)(p.default, {
          variant: "label",
          numberOfLines: 3,
          children: e.title
        }), (0, B.jsxs)(f.default, {
          style: U.place,
          children: [(0, B.jsx)(C.Icon, {
            name: "pin",
            size: 16,
            color: D.DesignColors.text
          }), (0, B.jsx)(p.default, {
            variant: "caption",
            numberOfLines: 1,
            style: {
              flex: 1
            },
            children: e.place
          })]
        })]
      })]
    });
  }
const React=t,View=f.default,Text=p.default,Pressable=o.default,Hero=j.default,Feather=h.Feather,ProfileTabs=_,ProfileEvent=V;
function MeBody({profile,loading,counts,mode,selected,tabs,onSelect,events,stats,conducted,navigation,featuredBadges,onSettings}){
  const audience=mode==='org'?'organizer':'guest';
  const openCollection=()=>navigation.navigate('Trophies',{audience});
  return <>
    <Hero compact profile={profile} loading={loading} featured={featuredBadges} onBadge={openCollection} onEdit={()=>navigation.navigate('EditProfile')} toolbar={<><View style={{flex:1}}/><Action icon="settings" label="настройки профиля" onPress={onSettings}/></>}/>
    <View style={ME.stats}><Stat value={mode==='org'?conducted:stats.attended} title={mode==='org'?'Провёл':'Посетил'} onPress={()=>onSelect('Прошедшие')}/><View style={ME.statDivider}/><Stat value={counts.followers} title="Подписчики"/>{mode!=='org'&&<><View style={ME.statDivider}/><Stat value={counts.following} title="Подписки"/></>}</View>
    <View style={ME.achievementCard}>
      <Pressable accessibilityRole="button" accessibilityLabel="Открыть достижения" style={ME.achievementTop} onPress={openCollection}><View style={ME.achievementIcon}><Feather name="award" size={23} color="#efede5"/></View><View style={{flex:1,gap:3}}><Text variant="sectionTitle" style={ME.cardTitle}>Достижения</Text><Text variant="caption" style={ME.mutedSmall}>Ваша коллекция наград</Text></View><Feather name="arrow-up-right" size={21} color="#efede5"/></Pressable>
      <View style={ME.achievementFooter}><Pressable accessibilityRole="button" onPress={()=>navigation.navigate('EditProfile',{openPinnedBadges:true})} style={ME.footerButton}><Feather name="grid" size={15} color="#b7b5ae"/><Text variant="label" style={ME.footerText}>На профиле</Text></Pressable><View style={ME.footerDivider}/><Pressable accessibilityRole="button" style={ME.footerButton} onPress={()=>navigation.navigate('RewardWallet')}><Feather name="tag" size={15} color="#b7b5ae"/><Text variant="label" style={ME.footerText}>Промокоды</Text></Pressable></View>
    </View>
    <View style={ME.eventsHeading}><Text variant="sectionTitle" style={ME.sectionTitle}>Мои события</Text></View>
    <ProfileTabs items={tabs} selected={selected} onSelect={onSelect}/>
    {selected==='Прошедшие'&&mode!=='org'&&<Text variant="caption" style={ME.mutedSmall}>Посещения, подтверждённые билетом на входе</Text>}
    {events.loading?<View style={ME.empty}><Text variant="caption" style={ME.muted}>Загружаем события…</Text></View>:events.failed?<View style={ME.empty}><Text>Не удалось загрузить события</Text><Pressable style={ME.edit} accessibilityRole="button" onPress={events.reload}><Text>Повторить</Text></Pressable></View>:events.events.length?<View style={U.grid}>{events.events.map((event,index)=><ProfileEvent key={event.id} event={event} wide={index%3===2} onPress={()=>navigation.navigate(mode==='org'&&selected==='Ближайшие'?'OrgEventDetail':'EventDetail',{eventId:event.id})}/>)}</View>:<View style={ME.empty}><Feather name={selected==='Избранное'?'heart':'calendar'} size={25} color="#b7b5ae"/><Text variant="label" style={ME.emptyTitle}>{selected==='Избранное'?'Сохраните то, что интересно':selected==='Прошедшие'?'Здесь появятся ваши посещения':'Ближайших событий пока нет'}</Text><Text variant="caption" style={ME.muted}>{selected==='Избранное'?'Нажмите сердце на событии — оно появится здесь.':selected==='Прошедшие'?'Посещение засчитается после сканирования билета.':'События с действующими билетами появятся здесь.'}</Text></View>}
  </>;
}
function Action({icon,label,onPress}){return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={ME.action}><Feather name={icon} size={20} color="#efede5"/></Pressable>}
function Stat({value,title,onPress}){const content=<><Text variant="sectionTitle">{value}</Text><Text variant="caption" style={U.statLabel}>{title}</Text></>;return onPress?<Pressable accessibilityRole="button" accessibilityLabel={title+': '+value} onPress={onPress} style={ME.stat}>{content}</Pressable>:<View style={ME.stat}>{content}</View>}
function MenuRow({icon,title,onPress}){return <Pressable accessibilityRole="button" onPress={onPress} style={ME.menuRow}><Feather name={icon} size={19} color="#b7b5ae"/><Text variant="label" style={{flex:1,fontSize:15}}>{title}</Text><Feather name="chevron-right" size={19} color="#b7b5ae"/></Pressable>}
const ME={
 action:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'#363633',alignItems:'center',justifyContent:'center',backgroundColor:'#101010'},
 edit:{flexDirection:'row',gap:9,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#41413e',borderRadius:24,minHeight:44,paddingHorizontal:24},
 stats:{flexDirection:'row',alignItems:'center',paddingVertical:6,marginBottom:2},stat:{flex:1,alignItems:'center',justifyContent:'center',minHeight:56,gap:4},statDivider:{height:26,width:1,backgroundColor:'#30302e'},
 achievementCard:{borderWidth:1,borderColor:'#393937',borderRadius:22,backgroundColor:'#191918',overflow:'hidden'},achievementTop:{flexDirection:'row',alignItems:'center',gap:13,padding:18,minHeight:86},achievementIcon:{width:45,height:45,borderRadius:16,backgroundColor:'#272726',alignItems:'center',justifyContent:'center'},cardTitle:{fontSize:18,lineHeight:23},mutedSmall:{fontSize:10,lineHeight:15,color:'#b7b5ae'},achievementFooter:{flexDirection:'row',borderTopWidth:1,borderColor:'#343431',alignItems:'center',paddingHorizontal:8},footerButton:{flex:1,minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},footerText:{fontSize:11,color:'#d0cec6'},footerDivider:{width:1,height:20,backgroundColor:'#343431'},
 eventsHeading:{marginTop:14,marginBottom:-4},sectionTitle:{fontSize:22,lineHeight:28},empty:{padding:24,gap:14,alignItems:'center',backgroundColor:'#191918',borderRadius:20},emptyTitle:{fontSize:15,textAlign:'center'},muted:{fontSize:12,lineHeight:18,color:'#b7b5ae',textAlign:'center'},
 heading:{flexDirection:'row',alignItems:'center',gap:8},pageTitle:{fontSize:20,lineHeight:28,flex:1},smallButton:{minHeight:44,justifyContent:'center',paddingHorizontal:10,borderWidth:1,borderColor:'#41413e',borderRadius:22},smallText:{fontSize:11},
 filters:{flexDirection:'row',gap:5},filter:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',borderRadius:22,backgroundColor:'#20201e'},selectedFilter:{backgroundColor:'#efede5'},filterText:{fontSize:11},placeholderGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},placeholderTile:{width:'46%',flexGrow:1,minHeight:158,borderWidth:1,borderColor:'#30302e',borderRadius:20,alignItems:'center',justifyContent:'center',gap:12,backgroundColor:'#171716'},focusedTile:{borderColor:'#efede5'},placeholderCircle:{width:60,height:60,borderRadius:30,backgroundColor:'#30302e'},placeholderLine:{width:'60%',height:6,borderRadius:3,backgroundColor:'#44443f'},structureNote:{padding:16,borderRadius:16,backgroundColor:'#20201e'},menuRow:{minHeight:60,flexDirection:'row',alignItems:'center',gap:12,borderTopWidth:1,borderColor:'#30302e'},pinSlots:{flexDirection:'row',gap:12,justifyContent:'center',marginVertical:12},pinSlot:{width:76,height:76,borderRadius:38,borderStyle:'dashed',borderWidth:1,borderColor:'#68685f',alignItems:'center',justifyContent:'center'},primary:{minHeight:48,borderRadius:24,backgroundColor:'#efede5',alignItems:'center',justifyContent:'center'},primaryText:{fontSize:14,color:'#171717'}
};

  const U = u.default.create({
    hero: {
      position: 'relative',
      marginHorizontal: -8,
      paddingBottom: 8
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8
    },
    round: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: D.DesignColors.photoProtection
    },
    identity: {
      alignItems: 'center',
      gap: 4
    },
    portraitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      paddingHorizontal: 8,
      gap: 8
    },
    avatar: {
      borderRadius: 60,
      borderWidth: 1,
      borderColor: D.DesignColors.text
    },
    add: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: D.DesignColors.text,
      alignItems: 'center',
      justifyContent: 'center'
    },
    name: {
      textAlign: 'center',
      textTransform: 'uppercase',
      marginTop: 8
    },
    username: {
      minHeight: 36,
      justifyContent: 'center'
    },
    featured: {
      flexDirection: 'row',
      gap: 24,
      marginTop: 16
    },
    stats: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      borderRadius: D.DesignShape.card,
      backgroundColor: D.DesignColors.surface,
      paddingVertical: 16
    },
    stat: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingHorizontal: 4
    },
    statLabel: {
      textAlign: 'center',
      fontSize: 10,
      lineHeight: 14
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: D.DesignColors.surface,
      borderRadius: D.DesignShape.pill,
      padding: 3
    },
    tabIndicator: {
      position: 'absolute',
      left: 3,
      top: 3,
      bottom: 3,
      borderRadius: D.DesignShape.pill,
      backgroundColor: D.DesignColors.actionPrimary
    },
    tab: {
      flex: 1,
      minHeight: 48,
      borderRadius: D.DesignShape.pill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12
    },
    event: {
      width: '47%',
      flexGrow: 1,
      minHeight: 188,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      justifyContent: 'space-between'
    },
    wide: {
      width: '100%'
    },
    date: {
      padding: 12
    },
    eventBody: {
      padding: 12,
      gap: 6
    },
    place: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    },
    empty: {
      padding: 20,
      gap: 12,
      backgroundColor: D.DesignColors.surface,
      borderRadius: D.DesignShape.card,
      alignItems: 'center'
    },
    note: {
      textAlign: 'center',
      color: D.DesignColors.textSecondary
    },
    awards: {
      padding: 16,
      borderRadius: D.DesignShape.card,
      backgroundColor: D.DesignColors.surface,
      gap: 12
    },
    awardsHead: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    all: {
      minHeight: 48,
      justifyContent: 'center'
    },
    award: {
      width: 76,
      alignItems: 'center',
      gap: 8
    },
    awardName: {
      fontSize: 10,
      lineHeight: 14,
      textAlign: 'center'
    }
  });
};
