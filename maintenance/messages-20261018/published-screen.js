function (g, r, _i, a, m, _e, d) {
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
      return O;
    }
  });
  var t = r(d[0]),
    s = e(r(d[1])),
    i = e(r(d[2])),
    o = e(r(d[3])),
    l = e(r(d[4])),
    n = e(r(d[5])),
    c = e(r(d[6])),
    u = r(d[7]),
    p = e(r(d[8])),
    y = e(r(d[9])),
    h = e(r(d[10])),
    f = e(r(d[11])),
    x = r(d[12]),
    b = e(r(d[13])),
    j = r(d[14]),
    C = e(r(d[15])),
    w = e(r(d[16])),
    D = e(r(d[17])),
    T = r(d[18]),
    k = r(d[19]),
    S = r(d[20]),
    v = r(d[21]),
    I = r(d[22]),
    L = r(d[23]);
  const H = I.palettes.dark,
    P = 56;
  function O() {
    const {
        tight: e
      } = (0, v.useLayout)(),
      n = e ? I.Spacing.md : I.Spacing.xl,
      {
        userId: C
      } = (0, S.useAuth)(),
      {
        chats: P,
        loading: O,
        reload: F
      } = (0, k.useDmChats)(),
      {
        chats: R,
        loading: E,
        reload: W
      } = (0, k.useEventChats)(),
      N = (0, u.useNavigation)(),
      _ = (0, u.useRoute)(),
      q = (0, u.useNavigation)(),
      [V, A] = (0, t.useState)(""),
      [M, U] = (0, t.useState)(!1),
      K = V.trim(),
      G = K.replace(/^@+/, "").length >= 2,
      [J, Q] = (0, t.useState)({
        query: "",
        people: []
      }),
      [X, Y] = (0, t.useState)(!1),
      Z = G && J.query === K ? J.people : [],
      $ = G && J.query !== K;
    (0, u.useFocusEffect)((0, t.useCallback)(() => {
      if (!C || !G) return;
      let e = !0;
      Y(!1);
      const t = setTimeout(async () => {
        try {
          const t = await (0, x.searchPeople)(K, C);
          e && Q({
            query: K,
            people: t
          });
        } catch {
          e && (Y(!0), Q({
            query: K,
            people: []
          }));
        }
      }, 300);
      return () => {
        e = !1, clearTimeout(t);
      };
    }, [K, G, C]));
    const ee = (0, t.useCallback)(async e => {
      if (!C) return;
      const t = !e.isFollowing,
        s = t => Q(s => Object.assign({}, s, {
          people: s.people.map(s => s.id === e.id ? Object.assign({}, s, {
            isFollowing: t
          }) : s)
        }));
      s(t);
      (t ? await (0, x.follow)(C, e.id) : await (0, x.unfollow)(C, e.id)) || s(!t);
    }, [C]);
    (0, k.useChatListLive)((0, t.useCallback)(() => {
      W(), F();
    }, [W, F]));
    const te = (0, t.useCallback)(e => {
        N.navigate("Chat", {
          chatId: e.id,
          type: e.type,
          name: e.name,
          sub: e.sub,
          initials: e.initials
        });
      }, [N]),
      se = _.params?.dmWith,
      ie = _.params?.dmName;
    if ((0, t.useEffect)(() => {
      se && (q.setParams({
        dmWith: void 0,
        dmName: void 0
      }), te({
        id: se,
        type: "dm",
        name: ie || "Личный чат",
        initials: (ie || "·").trim().slice(0, 2).toUpperCase(),
        preview: "",
        time: ""
      }));
    }, [se, ie, q, te]), !C) return (0, L.jsx)(p.default, {
      children: (0, L.jsx)(D.default, {
        glyph: "msg",
        title: "Чаты открываются со своими",
        text: "Отметьтесь «иду» — и попадёте в чат события. Личные переписки заводятся из «кто идёт».",
        reason: "chat",
        onDone: () => {
          W(), F();
        }
      })
    });
    const oe = [...R, ...P].sort(k.byFreshest),
      le = V.trim().toLowerCase(),
      ne = le ? oe.filter(e => e.name.toLowerCase().includes(le) || e.sub?.toLowerCase().includes(le) || e.preview.toLowerCase().includes(le)) : oe,
      ae = !(E || O || oe.length || le);
    return (0, L.jsxs)(p.default, {
      children: [(0, L.jsx)(s.default, {
        style: v.columnContent,
        children: (0, L.jsx)(b.default, {
          design: "2026",
          title: "Сообщения"
        })
      }), (0, L.jsx)(s.default, {
        style: [v.columnContent, {
          paddingHorizontal: n
        }],
        children: (0, L.jsxs)(s.default, {
          style: [z.search, M && z.focus],
          children: [(0, L.jsx)(T.Icon, {
            name: "search",
            size: I.IconSize.sm,
            color: H.gray4
          }), (0, L.jsx)(o.default, {
            style: z.searchInput,
            placeholder: "поиск",
            placeholderTextColor: H.gray5,
            value: V,
            onChangeText: A,
            returnKeyType: "search",
            accessibilityLabel: "поиск чатов и людей",
            onFocus: () => U(!0),
            onBlur: () => U(!1)
          }), !!V && (0, L.jsx)(l.default, {
            onPress: () => A(""),
            style: ({
              pressed: e
            }) => [z.clear, e && I.PRESSED],
            accessibilityRole: "button",
            accessibilityLabel: "очистить",
            children: (0, L.jsx)(T.Icon, {
              name: "x",
              size: I.IconSize.sm,
              color: H.gray4
            })
          })]
        })
      }), E && !oe.length && (0, L.jsx)(s.default, {
        style: [z.skeletons, {
          paddingHorizontal: n
        }],
        children: [0, 1, 2].map(e => (0, L.jsxs)(s.default, {
          style: z.skelRow,
          children: [(0, L.jsx)(w.default, {
            style: z.skelFace
          }), (0, L.jsxs)(s.default, {
            style: z.skelBody,
            children: [(0, L.jsx)(w.default, {
              style: z.skelLine
            }), (0, L.jsx)(w.default, {
              style: z.skelLineShort
            })]
          })]
        }, e))
      }), le ? (0, L.jsxs)(i.default, {
        keyboardShouldPersistTaps: "handled",
        showsVerticalScrollIndicator: !1,
        contentContainerStyle: [v.columnContent, z.list, {
          paddingHorizontal: n
        }],
        children: [(0, L.jsx)(y.default, {
          style: z.resultHeading,
          children: "Чаты"
        }), ne.map(e => (0, L.jsx)(B, {
          chat: e,
          onPress: () => te(e)
        }, e.id)), !ne.length && (0, L.jsx)(y.default, {
          style: z.resultHint,
          children: "Чаты не найдены"
        }), (0, L.jsx)(y.default, {
          style: [z.resultHeading, z.peopleHeading],
          children: "Люди"
        }), G ? $ ? (0, L.jsx)(c.default, {
          color: j.DesignColors.text,
          accessibilityLabel: "Поиск людей"
        }) : X ? (0, L.jsx)(y.default, {
          style: z.resultHint,
          children: "Не удалось загрузить людей. Попробуйте ещё раз."
        }) : Z.length ? Z.map(e => (0, L.jsx)(f.default, {
          person: e,
          style: z.personCard,
          onOpenProfile: () => N.navigate("UserProfile", {
            userId: e.id
          }),
          onToggle: () => ee(e),
          onMessage: () => te({
            id: e.id,
            type: "dm",
            name: e.name,
            initials: e.initials,
            preview: "",
            time: ""
          })
        }, e.id)) : (0, L.jsx)(y.default, {
          style: z.resultHint,
          children: "Люди не найдены"
        }) : (0, L.jsx)(y.default, {
          style: z.resultHint,
          children: "Введите хотя бы 2 символа имени или никнейма"
        })]
      }) : ae ? (0, L.jsxs)(s.default, {
        style: z.empty,
        children: [(0, L.jsx)(T.Icon, {
          name: "msg",
          size: I.IconSize.lg,
          color: H.gray4
        }), (0, L.jsx)(y.default, {
          style: z.emptyTitle,
          children: "Чатов пока нет"
        }), (0, L.jsx)(y.default, {
          style: z.emptyText,
          children: "Отметьтесь «иду» на событии — и его чат появится здесь."
        }), (0, L.jsx)(h.default, {
          label: "Найти события",
          accessibilityLabel: "найти события",
          onPress: () => N.navigate("Tabs", {
            screen: "Explore"
          })
        })]
      }) : (0, L.jsx)(i.default, {
        keyboardShouldPersistTaps: "handled",
        showsVerticalScrollIndicator: !1,
        contentContainerStyle: [v.columnContent, z.list, {
          paddingHorizontal: n
        }],
        children: ne.map(e => (0, L.jsx)(B, {
          chat: e,
          onPress: () => te(e)
        }, e.id))
      })]
    });
  }
  function B({
    chat: e,
    onPress: i
  }) {
    const [o, n] = (0, t.useState)(!1);
    return (0, L.jsxs)(l.default, {
      style: ({
        pressed: e
      }) => [z.row, o && z.focus, e && I.PRESSED],
      onFocus: () => n(!0),
      onBlur: () => n(!1),
      onPress: i,
      accessibilityRole: "button",
      accessibilityLabel: e.name,
      children: [(0, L.jsx)(C.default, {
        design: "2026",
        name: e.name,
        initials: e.initials,
        size: P
      }), (0, L.jsxs)(s.default, {
        style: z.rowBody,
        children: [(0, L.jsxs)(s.default, {
          style: z.rowTop,
          children: [(0, L.jsx)(y.default, {
            style: z.rowName,
            numberOfLines: 1,
            children: e.name
          }), (0, L.jsx)(y.default, {
            style: z.rowTime,
            children: e.time
          })]
        }), (0, L.jsx)(s.default, {
          style: z.rowBottom,
          children: (0, L.jsx)(y.default, {
            style: z.rowPreview,
            numberOfLines: 1,
            children: e.preview || e.sub || " "
          })
        })]
      }), (0, L.jsx)(s.default, {
        pointerEvents: "none",
        style: z.rowDivider
      })]
    });
  }
  const z = n.default.create({
    resultHeading: Object.assign({}, j.DesignTypography.sectionTitle, {
      color: j.DesignColors.text,
      marginBottom: 4
    }),
    peopleHeading: {
      marginTop: 16
    },
    resultHint: Object.assign({}, j.DesignTypography.body, {
      color: j.DesignColors.textSecondary,
      paddingVertical: 8
    }),
    personCard: {
      backgroundColor: j.DesignColors.background,
      marginBottom: 8
    },
    search: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
      minHeight: 52,
      paddingLeft: 16,
      paddingRight: 4,
      borderRadius: 24,
      backgroundColor: j.DesignColors.background,
      borderWidth: 1,
      borderColor: j.DesignColors.fieldBorder
    },
    searchInput: Object.assign({}, j.DesignTypography.body, {
      flex: 1,
      minWidth: 0,
      color: j.DesignColors.text,
      padding: 0,
      outlineWidth: 0
    }),
    clear: {
      width: 48,
      minHeight: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 24
    },
    focus: {
      outlineWidth: 2,
      outlineColor: j.DesignColors.focus,
      outlineOffset: 2,
      borderColor: j.DesignColors.focus
    },
    list: {
      paddingTop: 4,
      paddingBottom: 24
    },
    skeletons: {
      paddingVertical: 16,
      gap: 16
    },
    skelRow: {
      flexDirection: "row",
      gap: 12
    },
    skelFace: {
      width: P,
      height: P,
      borderRadius: 28
    },
    skelBody: {
      flex: 1,
      gap: 6,
      justifyContent: "center"
    },
    skelLine: {
      height: 13,
      width: "60%"
    },
    skelLineShort: {
      height: 11,
      width: "40%"
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      minHeight: 84,
      paddingVertical: 12,
      backgroundColor: j.DesignColors.background
    },
    rowDivider: {
      position: "absolute",
      bottom: 0,
      left: 70,
      right: 0,
      height: n.default.hairlineWidth,
      backgroundColor: j.DesignColors.border
    },
    rowBody: {
      flex: 1,
      minWidth: 0,
      gap: 4
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 8
    },
    rowName: Object.assign({}, j.DesignTypography.body, {
      fontFamily: j.DesignTypography.label.fontFamily,
      flex: 1,
      minWidth: 0,
      color: j.DesignColors.text
    }),
    rowTime: Object.assign({}, j.DesignTypography.caption, {
      color: j.DesignColors.textSecondary,
      flexShrink: 0
    }),
    rowBottom: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    rowPreview: Object.assign({}, j.DesignTypography.label, {
      fontFamily: j.DesignTypography.body.fontFamily,
      flex: 1,
      color: j.DesignColors.textSecondary
    }),
    empty: Object.assign({
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      paddingHorizontal: 24,
      paddingBottom: 32
    }, v.columnContent),
    emptyTitle: Object.assign({}, j.DesignTypography.sectionTitle, {
      color: j.DesignColors.text,
      textAlign: "center"
    }),
    emptyText: Object.assign({}, j.DesignTypography.body, {
      color: j.DesignColors.textSecondary,
      textAlign: "center"
    })
  });
}