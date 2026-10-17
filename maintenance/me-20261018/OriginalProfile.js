function (g, r, i, a, m, _e, d) {
  "use strict";

  function e(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }
  Object.defineProperty(_e, "__esModule", {
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
  const O = ["Ближайшие", "Избранное", "Прошедшие"],
    T = ["Ближайшие", "Прошедшие"];
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
      [E, F] = (0, t.useState)("Ближайшие"),
      {
        mode: W
      } = (0, R.useMode)(),
      $ = "org" === W && "Избранное" === E ? "Ближайшие" : E,
      G = "org" === W ? T : O,
      X = (0, k.useOrganizerProfileEvents)(w, "org" === W);
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      "org" === W && X.refetch();
    }, [W, X.refetch]));
    const q = "org" === W ? "organizer" : "guest",
      J = (0, k.useConductedEventCount)(w, "org" === W);
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      "org" === W && J.refetch();
    }, [W, J.refetch]));
    const {
        stats: K,
        earned: Q,
        primaryBadge: Y,
        loading: Z
      } = (0, I.useAchievements)(q),
      ee = (0, S.useRewardBadges)(!0),
      te = (0, L.mergeProfileBadges)(Q, ee.isError ? [] : ee.data ?? [], q),
      ae = (0, A.useUpcomingProfileEvents)("org" !== W && "Ближайшие" === $),
      ie = (0, z.useSavedEvents)("org" !== W && "Избранное" === $),
      ne = (0, H.useAttendedEvents)("org" !== W && "Прошедшие" === $),
      re = ae.reload;
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      "org" !== W && "Ближайшие" === $ && re();
    }, [W, $, re]));
    const se = "org" === W ? {
        events: X.data?.["Прошедшие" === $ ? "past" : "upcoming"] ?? [],
        loading: X.isPending,
        failed: X.isError,
        reload: X.refetch
      } : "Ближайшие" === $ ? ae : "Избранное" === $ ? ie : ne,
      le = [Y, ...te.map(e => e.def).filter(e => e.id !== Y?.id)].filter(e => !!e).slice(0, 3),
      oe = e.pinnedBadges?.map(e => te.find(t => t.def.id === e)?.def).filter(e => !!e).slice(0, 3),
      de = 0 === e.pinnedBadges?.length ? [] : oe?.length ? oe : le,
      ce = te.slice(0, 6),
      ue = () => x.navigate("Trophies", {
        audience: q
      });
    return (0, B.jsxs)(B.Fragment, {
      children: [(0, B.jsx)(j.default, {
        compact: !0,
        profile: e,
        loading: s,
        onEdit: () => x.navigate("EditProfile"),
        featured: de,
        onBadge: ue,
        toolbar: (0, B.jsxs)(B.Fragment, {
          children: [(0, B.jsx)(N, {
            icon: "bell",
            label: "уведомления",
            onPress: () => x.navigate("Notifications")
          }), (0, B.jsx)(f.default, {
            style: {
              flex: 1
            }
          }), (0, B.jsx)(f.default, {
            ref: h,
            collapsable: !1,
            children: (0, B.jsx)(N, {
              icon: "settings",
              label: "настройки профиля",
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
          value: "org" === W ? J.data ?? 0 : K.attended,
          label: "org" === W ? "События провёл" : "События посетил",
          onPress: () => F("Прошедшие")
        }), (0, B.jsx)(M, {
          value: l.followers,
          label: "Подписчики"
        }), "org" !== W && (0, B.jsx)(M, {
          value: l.following,
          label: "Подписки"
        })]
      }), (0, B.jsx)(_, {
        items: G,
        selected: $,
        onSelect: F
      }), "org" !== W && "Прошедшие" === $ && (0, B.jsx)(p.default, {
        variant: "caption",
        style: U.note,
        children: "Посещения, подтверждённые билетом на входе"
      }), se.loading ? (0, B.jsx)(n.default, {
        color: D.DesignColors.text,
        style: {
          padding: 32
        }
      }) : ("org" === W ? X.isError : "Ближайшие" === $ && ae.failed) ? (0, B.jsxs)(f.default, {
        style: U.empty,
        children: [(0, B.jsx)(p.default, {
          children: "Не удалось загрузить события"
        }), (0, B.jsx)(y.default, {
          label: "Повторить",
          onPress: () => {
            "org" === W ? X.refetch() : ae.reload();
          }
        })]
      }) : se.events.length ? (0, B.jsx)(f.default, {
        style: U.grid,
        children: se.events.map((e, t) => (0, B.jsx)(V, {
          event: e,
          wide: t % 3 == 2,
          onPress: () => x.navigate("org" === W && "Ближайшие" === $ ? "OrgEventDetail" : "EventDetail", {
            eventId: e.id
          })
        }, e.id))
      }) : (0, B.jsxs)(f.default, {
        style: U.empty,
        children: [(0, B.jsx)(C.Icon, {
          name: "Избранное" === $ ? "heart" : "ticket",
          size: 24,
          color: D.DesignColors.textSecondary
        }), (0, B.jsx)(p.default, {
          variant: "label",
          children: "org" === W ? "Ближайшие" === $ ? "Анонсированных событий пока нет" : "Проведённых событий пока нет" : "Ближайшие" === $ ? "Ближайших событий пока нет" : "Избранное" === $ ? "Сохраните то, что интересно" : "Здесь появятся ваши посещения"
        }), (0, B.jsx)(p.default, {
          variant: "caption",
          style: U.note,
          children: "org" === W ? "Ближайшие" === $ ? "Здесь появятся ваши опубликованные события." : "После завершения события появятся здесь." : "Ближайшие" === $ ? "События с действующими билетами появятся здесь." : "Избранное" === $ ? "Нажмите сердце на событии — оно появится в этой вкладке." : "Посещение засчитается после сканирования билета."
        }), (0, B.jsx)(y.default, {
          label: "org" === W ? "Мои события" : "Смотреть афишу",
          onPress: () => x.navigate("Tabs", {
            screen: "org" === W ? "OrgEvents" : "Home"
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
            children: "Трофеи"
          }), (0, B.jsx)(o.default, {
            onPress: ue,
            accessibilityRole: "button",
            accessibilityLabel: "все трофеи",
            style: U.all,
            children: (0, B.jsx)(p.default, {
              variant: "caption",
              children: "Все трофеи ›"
            })
          })]
        }), ee.isLoading && (0, B.jsx)(n.default, {
          accessibilityLabel: "Загрузка новых трофеев"
        }), ee.isError && (0, B.jsxs)(B.Fragment, {
          children: [(0, B.jsx)(p.default, {
            accessibilityRole: "alert",
            children: "Не удалось загрузить трофеи новой программы."
          }), (0, B.jsx)(y.default, {
            label: "Повторить загрузку трофеев",
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
            children: "Полученные значки появятся здесь."
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
              children: e.id.startsWith("reward_") ? "Новая программа" : "Прежняя программа"
            })]
          }, e.id))]
        })]
      }), (0, B.jsx)(y.default, {
        label: "Промокоды",
        variant: "secondary",
        onPress: () => x.navigate("RewardWallet")
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
      accessibilityLabel: "События в профиле",
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
            textAlign: "center"
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
        colors: ["rgba(10,10,10,0.3)", "rgba(10,10,10,0.15)", "rgba(10,10,10,0.96)"],
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
  const U = u.default.create({
    hero: {
      position: "relative",
      marginHorizontal: -8,
      paddingBottom: 8
    },
    toolbar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8
    },
    round: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: D.DesignColors.photoProtection
    },
    identity: {
      alignItems: "center",
      gap: 4
    },
    portraitRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingHorizontal: 8,
      gap: 8
    },
    avatar: {
      borderRadius: 60,
      borderWidth: 1,
      borderColor: D.DesignColors.text
    },
    add: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: D.DesignColors.text,
      alignItems: "center",
      justifyContent: "center"
    },
    name: {
      textAlign: "center",
      textTransform: "uppercase",
      marginTop: 8
    },
    username: {
      minHeight: 36,
      justifyContent: "center"
    },
    featured: {
      flexDirection: "row",
      gap: 24,
      marginTop: 16
    },
    stats: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      borderRadius: D.DesignShape.card,
      backgroundColor: D.DesignColors.surface,
      paddingVertical: 16
    },
    stat: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: 4
    },
    statLabel: {
      textAlign: "center",
      fontSize: 10,
      lineHeight: 14
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: D.DesignColors.surface,
      borderRadius: D.DesignShape.pill,
      padding: 3
    },
    tabIndicator: {
      position: "absolute",
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
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12
    },
    event: {
      width: "47%",
      flexGrow: 1,
      minHeight: 188,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      justifyContent: "space-between"
    },
    wide: {
      width: "100%"
    },
    date: {
      padding: 12
    },
    eventBody: {
      padding: 12,
      gap: 6
    },
    place: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4
    },
    empty: {
      padding: 20,
      gap: 12,
      backgroundColor: D.DesignColors.surface,
      borderRadius: D.DesignShape.card,
      alignItems: "center"
    },
    note: {
      textAlign: "center",
      color: D.DesignColors.textSecondary
    },
    awards: {
      padding: 16,
      borderRadius: D.DesignShape.card,
      backgroundColor: D.DesignColors.surface,
      gap: 12
    },
    awardsHead: {
      flexDirection: "row",
      alignItems: "center"
    },
    all: {
      minHeight: 48,
      justifyContent: "center"
    },
    award: {
      width: 76,
      alignItems: "center",
      gap: 8
    },
    awardName: {
      fontSize: 10,
      lineHeight: 14,
      textAlign: "center"
    }
  });
}
// DEPS: [36, 1018, 307, 388, 402, 319, 44, 312, 142, 1422, 1367, 1016, 1017, 1530, 1490, 1370, 1022, 950, 1007, 1006, 1028, 1481, 1531, 1533, 1486, 1416, 1337, 1534, 1400, 163]