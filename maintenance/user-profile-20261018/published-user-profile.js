function (g, r, i, a, m, _e, d) {
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
      return T;
    }
  });
  var t = r(d[0]),
    l = e(r(d[1]));
  r(d[2]);
  var s = e(r(d[3])),
    n = e(r(d[4])),
    o = e(r(d[5])),
    c = e(r(d[6])),
    f = e(r(d[7])),
    u = r(d[8]),
    x = e(r(d[9])),
    b = e(r(d[10])),
    h = e(r(d[11])),
    j = e(r(d[12])),
    p = e(r(d[13])),
    y = e(r(d[14])),
    w = e(r(d[15])),
    v = e(r(d[16])),
    C = e(r(d[17])),
    P = r(d[18]),
    D = r(d[19]),
    k = r(d[20]),
    L = r(d[21]),
    S = r(d[22]),
    z = r(d[23]),
    E = r(d[24]),
    I = r(d[25]),
    F = r(d[26]);
  function T({
    route: e,
    navigation: c
  }) {
    const T = e.params.userId,
      {
        userId: O
      } = (0, P.useAuth)(),
      _ = (0, I.useGoBack)(),
      A = (0, D.useColumnContent)(),
      B = (0, L.usePublicProfile)(T, O),
      H = B.refetch;
    (0, u.useFocusEffect)((0, t.useCallback)(() => {
      O && H();
    }, [H, O]));
    const [M, R] = (0, t.useState)(!1),
      [W, N] = (0, t.useState)(''),
      [q, G] = (0, t.useState)(null);
    (0, t.useEffect)(() => {
      N(''), G(null);
    }, [T]);
    const Q = B.data,
      V = T === O,
      J = async () => {
        if (O && Q && !M && !V) {
          R(!0), N('');
          try {
            const e = !Q.isFollowing;
            if (!(await (e ? (0, S.follow)(O, T) : (0, S.unfollow)(O, T)))) return void N('\u041d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.');
            z.queryClient.setQueryData(['public-user-profile', T, O], t => t ? Object.assign({}, t, {
              isFollowing: e,
              followers: Math.max(0, t.followers + (e ? 1 : -1))
            }) : t);
          } catch {
            N('\u041d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0443. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0432\u044f\u0437\u044c.');
          } finally {
            R(!1);
          }
        }
      },
      K = async () => {
        if (!Q) return;
        N('');
        const e = (0, E.userProfileLink)(T),
          t = `${Q.profile.name}${Q.profile.username ? ` \xb7 @${Q.profile.username}` : ''}\n${e}`;
        try {
          navigator.share ? await o.default.share({
            title: Q.profile.name,
            message: t
          }) : (await navigator.clipboard.writeText(t), N('\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u043f\u0440\u043e\u0444\u0438\u043b\u044c \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0430.'));
        } catch (e) {
          e instanceof Error && 'AbortError' === e.name || N('\u041d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u043b\u043e\u0441\u044c \u043f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u043c.');
        }
      };
    return O ? B.isPending || B.isError || !Q ? (0, F.jsxs)(x.default, {
      background: "bg",
      edges: ['top', 'bottom'],
      children: [(0, F.jsx)(b.default, {
        design: "2026",
        title: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c",
        onBack: _
      }), (0, F.jsx)(f.default, {
        style: $.empty,
        children: B.isPending ? (0, F.jsx)(l.default, {
          color: k.DesignColors.text,
          accessibilityLabel: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u043f\u0440\u043e\u0444\u0438\u043b\u044f"
        }) : (0, F.jsxs)(F.Fragment, {
          children: [(0, F.jsx)(j.default, {
            variant: "sectionTitle",
            children: B.isError ? '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c' : '\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d'
          }), (0, F.jsx)(j.default, {
            style: $.note,
            children: B.isError ? '\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u0432\u044f\u0437\u044c \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.' : '\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d \u0438\u043b\u0438 \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d.'
          }), B.isError && (0, F.jsx)(p.default, {
            label: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
            onPress: () => {
              H();
            }
          })]
        })
      })]
    }) : (0, F.jsxs)(x.default, {
      background: "bg",
      edges: ['top', 'bottom'],
      children: [(0, F.jsxs)(n.default, {
        contentContainerStyle: [$.body, A],
        children: [(0, F.jsx)(h.default, {
          profile: Q.profile,
          modeLabel: Q.isOrganizer ? '\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440' : void 0,
          featured: Q.featured,
          onBadge: G,
          message: W,
          toolbar: (0, F.jsxs)(F.Fragment, {
            children: [(0, F.jsx)(y.default, {
              icon: "back",
              label: "\u043d\u0430\u0437\u0430\u0434",
              onPress: _
            }), (0, F.jsx)(f.default, {
              style: {
                flex: 1
              }
            }), (0, F.jsx)(y.default, {
              icon: "share",
              label: "\u043f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f \u043f\u0440\u043e\u0444\u0438\u043b\u0435\u043c",
              onPress: () => {
                K();
              }
            })]
          })
        }), (0, F.jsxs)(f.default, {
          style: $.stats,
          children: [(0, F.jsxs)(f.default, {
            style: $.stat,
            children: [(0, F.jsx)(j.default, {
              variant: "sectionTitle",
              children: Q.attended
            }), (0, F.jsx)(j.default, {
              style: $.statLabel,
              children: '\u0421\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e\u0441\u0435\u0449\u0435\u043d\u043e'
            })]
          }), (0, F.jsxs)(f.default, {
            style: $.stat,
            accessibilityLabel: `\u041f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u0438: ${Q.followers}`,
            children: [(0, F.jsx)(j.default, {
              variant: "sectionTitle",
              children: Q.followers
            }), (0, F.jsx)(j.default, {
              style: $.statLabel,
              children: "\u041f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u0438"
            })]
          }), (0, F.jsxs)(f.default, {
            style: $.stat,
            accessibilityLabel: `\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0438: ${Q.following}`,
            children: [(0, F.jsx)(j.default, {
              variant: "sectionTitle",
              children: Q.following
            }), (0, F.jsx)(j.default, {
              style: $.statLabel,
              children: "\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0438"
            })]
          })]
        }), V ? (0, F.jsx)(p.default, {
          label: "\u041c\u043e\u0439 \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
          onPress: () => c.navigate('Tabs', {
            screen: 'Profile'
          })
        }) : (0, F.jsxs)(f.default, {
          style: $.actions,
          children: [(0, F.jsx)(p.default, {
            label: Q.isFollowing ? '\u0412\u044b \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u044b' : '\u041f\u043e\u0434\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f',
            variant: Q.isFollowing ? 'secondary' : 'primary',
            loading: M,
            onPress: () => {
              J();
            },
            style: {
              flex: 1
            }
          }), (0, F.jsx)(p.default, {
            label: "\u041d\u0430\u043f\u0438\u0441\u0430\u0442\u044c",
            variant: "secondary",
            onPress: () => c.navigate('Chat', {
              chatId: T,
              type: 'dm',
              name: Q.profile.name,
              initials: Q.profile.initials
            }),
            style: {
              flex: 1
            }
          })]
        }), Q.isOrganizer && (0, F.jsx)(p.default, {
          label: "\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440\u0430",
          variant: "secondary",
          onPress: () => c.navigate('OrganizerProfile', {
            organizerId: T
          })
        }), (0, F.jsxs)(f.default, {
          style: $.awards,
          children: [(0, F.jsx)(j.default, {
            variant: "label",
            children: "\u041d\u0430\u0433\u0440\u0430\u0434\u044b"
          }), Q.earned.length ? (0, F.jsx)(f.default, {
            style: $.grid,
            children: Q.earned.map(e => (0, F.jsxs)(s.default, {
              style: $.award,
              onPress: () => G(e),
              accessibilityRole: "button",
              accessibilityLabel: `\u043d\u0430\u0433\u0440\u0430\u0434\u0430 ${e.name}`,
              children: [(0, F.jsx)(w.default, {
                design: "2026",
                def: e,
                size: 52
              }), (0, F.jsx)(j.default, {
                variant: "caption",
                style: $.awardName,
                children: e.name
              })]
            }, e.id))
          }) : (0, F.jsx)(j.default, {
            style: $.note,
            children: "\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043d\u044b\u0445 \u043d\u0430\u0433\u0440\u0430\u0434 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442."
          })]
        })]
      }), q && (0, F.jsx)(v.default, {
        design: "2026",
        title: q.name,
        onClose: () => G(null),
        children: (0, F.jsxs)(f.default, {
          style: $.badgeDetail,
          children: [(0, F.jsx)(w.default, {
            design: "2026",
            def: q,
            size: 72
          }), (0, F.jsx)(j.default, {
            children: q.description
          })]
        })
      })]
    }) : (0, F.jsxs)(x.default, {
      background: "bg",
      edges: ['top', 'bottom'],
      children: [(0, F.jsx)(b.default, {
        design: "2026",
        title: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c",
        onBack: _
      }), (0, F.jsx)(C.default, {
        glyph: "users",
        title: "\u041f\u043e\u0437\u043d\u0430\u043a\u043e\u043c\u044c\u0442\u0435\u0441\u044c \u0441\u043e \u0441\u0432\u043e\u0438\u043c\u0438",
        text: "\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043f\u0440\u043e\u0444\u0438\u043b\u044c, \u0447\u0442\u043e\u0431\u044b \u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u0438 \u043b\u044e\u0434\u0435\u0439, \u043f\u043e\u0434\u043f\u0438\u0441\u044b\u0432\u0430\u0442\u044c\u0441\u044f \u0438 \u043e\u0431\u0449\u0430\u0442\u044c\u0441\u044f.",
        reason: "profile"
      })]
    });
  }
  const $ = c.default.create({
    body: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 32,
      gap: 20
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      gap: 16
    },
    note: {
      color: k.DesignColors.textSecondary,
      textAlign: 'center'
    },
    stats: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: k.DesignColors.border,
      borderRadius: k.DesignShape.card,
      backgroundColor: k.DesignColors.surface,
      paddingVertical: 16
    },
    stat: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      minHeight: 48
    },
    statLabel: {
      textAlign: 'center',
      fontSize: 12,
      lineHeight: 18,
      color: k.DesignColors.textSecondary
    },
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12
    },
    awards: {
      padding: 16,
      borderRadius: k.DesignShape.card,
      backgroundColor: k.DesignColors.surface,
      gap: 16
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16
    },
    award: {
      width: 76,
      alignItems: 'center',
      gap: 8,
      minHeight: 84
    },
    awardName: {
      fontSize: 10,
      lineHeight: 14,
      textAlign: 'center'
    },
    badgeDetail: {
      padding: 24,
      alignItems: 'center',
      gap: 16
    }
  });
}