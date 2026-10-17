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
      return F;
    }
  });
  var t = r(d[0]),
    l = e(r(d[1])),
    n = e(r(d[2]));
  r(d[3]);
  var s = e(r(d[4])),
    o = e(r(d[5])),
    c = e(r(d[6])),
    u = e(r(d[7])),
    f = e(r(d[8])),
    b = r(d[9]),
    p = e(r(d[10])),
    x = e(r(d[11])),
    h = e(r(d[12])),
    y = e(r(d[13])),
    j = e(r(d[14])),
    C = e(r(d[15])),
    v = r(d[16]),
    D = r(d[17]),
    w = e(r(d[18])),
    R = r(d[19]),
    P = e(r(d[20])),
    I = r(d[21]),
    B = r(d[22]),
    z = r(d[23]),
    k = r(d[24]),
    L = r(d[25]),
    S = r(d[26]),
    H = r(d[27]),
    T = r(d[28]),
    q = r(d[29]),
    A = r(d[30]);
  const W = ['\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435', '\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435'];
  function F({
    route: e,
    navigation: c
  }) {
    const {
        organizerId: F
      } = e.params,
      {
        org: O,
        loading: E
      } = (0, k.useOrganizer)(F),
      V = (0, k.useOrganizerProfileEvents)(F, !!O),
      {
        userId: M
      } = (0, z.useAuth)(),
      N = (0, L.useAchievements)('organizer'),
      Q = (0, S.useRewardBadges)(M === F),
      {
        following: U,
        toggle: $,
        canFollow: G,
        busy: J
      } = (0, k.useFollowOrganizer)(M, F),
      K = (0, q.useGoBack)(),
      X = (0, b.useSafeAreaInsets)(),
      [Y, Z] = (0, t.useState)('\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435'),
      [ee, te] = (0, t.useState)(!1),
      [ae, le] = (0, t.useState)(null),
      [ne, se] = (0, t.useState)(''),
      [ie, re] = (0, t.useState)(!1),
      [oe, de] = (0, t.useState)(!1),
      [ce, ue] = (0, t.useState)(!1),
      ge = (0, A.jsx)(h.default, {
        icon: "back",
        label: "\u043d\u0430\u0437\u0430\u0434",
        onPress: K
      });
    if (E || !O) return (0, A.jsxs)(f.default, {
      style: [_.screen, _.center],
      children: [(0, A.jsx)(f.default, {
        style: _.loadingBack,
        children: ge
      }), E ? (0, A.jsx)(l.default, {
        color: I.DesignColors.text
      }) : (0, A.jsx)(p.default, {
        children: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d"
      })]
    });
    const fe = M === F ? (0, H.mergeProfileBadges)(N.earned, Q.data ?? [], 'organizer').map(e => e.def) : [],
      be = (O.pinnedBadges ?? []).map(H.profileBadgeDefinition).filter(e => !!e && 'organizer' === e.audience),
      pe = 0 === O.pinnedBadges?.length ? [] : be.length ? be : [N.primaryBadge, ...fe.filter(e => e.id !== N.primaryBadge?.id)].filter(e => !!e && M === F).slice(0, 3),
      xe = fe.length ? fe : be,
      he = V.data?.['\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435' === Y ? 'past' : 'upcoming'] ?? [],
      ye = async () => {
        try {
          await navigator.clipboard.writeText((0, T.organizerProfileLink)(F)), se(''), re(!1), de(false);
        } catch {
          se('\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.'), re(!1);
        }
      };
    return (0, A.jsxs)(f.default, {
      style: _.screen,
      children: [(0, A.jsxs)(o.default, {
        showsVerticalScrollIndicator: !1,
        contentContainerStyle: [B.columnContent, _.content, {
          paddingTop: X.top + 16,
          paddingBottom: X.bottom + 32
        }],
        children: [(0, A.jsx)(y.default, {
          compact: !0,
          profile: {
            name: O.name,
            initials: O.initials,
            username: O.username,
            bio: O.bio,
            city: O.city,
            avatarUrl: O.avatarUrl ?? void 0
          },
          featured: pe,
          onBadge: le,
          message: ne,
          toolbar: (0, A.jsxs)(A.Fragment, {
            children: [ge, (0, A.jsx)(f.default, {
              style: {
                flex: 1
              }
            })]
          })
        }), (0, A.jsxs)(f.default, {
          style: _.profileActions,
          children: [(0, A.jsx)(x.default, {
            label: U ? '\u0412\u044b \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u044b' : '\u041f\u043e\u0434\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f',
            variant: U ? 'secondary' : 'primary',
            selected: U,
            loading: J,
            disabled: !G,
            accessibilityLabel: U ? '\u043e\u0442\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f' : '\u043f\u043e\u0434\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f',
            style: _.followButton,
            onPress: () => {
              $();
            }
          }), (0, A.jsx)(s.default, {
            accessibilityRole: "button",
            accessibilityLabel: "поделиться профилем",
            style: _.actionIcon,
            onPress: () => {
              se('');
              de(true);
            },
            children: (0, A.jsx)(R.Icon, {
              name: "share",
              size: 24,
              color: I.DesignColors.text
            })
          }), (0, A.jsx)(s.default, {
            accessibilityRole: "button",
            accessibilityLabel: "\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f \u043f\u0440\u043e\u0444\u0438\u043b\u044f",
            style: _.actionIcon,
            onPress: () => re(!0),
            children: (0, A.jsx)(v.Feather, {
              name: "more-horizontal",
              size: 24,
              color: I.DesignColors.text
            })
          })]
        }), (0, A.jsxs)(f.default, {
          style: _.stats,
          children: [(0, A.jsxs)(s.default, {
            style: _.stat,
            accessibilityRole: "button",
            accessibilityLabel: `\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u043f\u0440\u043e\u0432\u0451\u043b: ${V.data?.past.length ?? 0}`,
            onPress: () => Z('\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435'),
            children: [(0, A.jsx)(p.default, {
              variant: "sectionTitle",
              children: V.data?.past.length ?? 0
            }), (0, A.jsx)(p.default, {
              variant: "caption",
              style: _.statLabel,
              children: "\u0421\u043e\u0431\u044b\u0442\u0438\u044f \u043f\u0440\u043e\u0432\u0451\u043b"
            })]
          }), (0, A.jsxs)(f.default, {
            style: _.stat,
            children: [(0, A.jsx)(p.default, {
              variant: "sectionTitle",
              children: O.followers
            }), (0, A.jsx)(p.default, {
              variant: "caption",
              style: _.statLabel,
              children: "\u041f\u043e\u0434\u043f\u0438\u0441\u0447\u0438\u043a\u0438"
            })]
          })]
        }), (0, A.jsx)(D.ProfileTabs, {
          items: W,
          selected: Y,
          onSelect: e => {
            '\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435' !== e && Z(e);
          }
        }), V.isPending ? (0, A.jsx)(l.default, {
          color: I.DesignColors.text,
          style: {
            padding: 32
          }
        }) : V.isError ? (0, A.jsxs)(f.default, {
          style: _.empty,
          children: [(0, A.jsx)(p.default, {
            children: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u043e\u0431\u044b\u0442\u0438\u044f"
          }), (0, A.jsx)(x.default, {
            label: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
            onPress: () => {
              V.refetch();
            }
          })]
        }) : he.length ? (0, A.jsx)(f.default, {
          style: _.grid,
          children: he.map((e, t) => (0, A.jsx)(D.ProfileEvent, {
            event: e,
            wide: t % 3 == 2,
            onPress: () => c.navigate('EventDetail', {
              eventId: e.id,
              archivePreview: '\u041f\u0440\u043e\u0448\u0435\u0434\u0448\u0438\u0435' === Y
            })
          }, e.id))
        }) : (0, A.jsx)(f.default, {
          style: _.empty,
          children: (0, A.jsx)(p.default, {
            variant: "caption",
            style: _.muted,
            children: '\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435' === Y ? '\u0410\u043d\u043e\u043d\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442' : '\u041f\u0440\u043e\u0432\u0435\u0434\u0451\u043d\u043d\u044b\u0445 \u0441\u043e\u0431\u044b\u0442\u0438\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442'
          })
        }), !!xe.length && (0, A.jsxs)(f.default, {
          style: _.trophies,
          children: [(0, A.jsxs)(f.default, {
            style: _.sectionHead,
            children: [(0, A.jsx)(p.default, {
              variant: "label",
              children: "\u0422\u0440\u043e\u0444\u0435\u0438"
            }), (0, A.jsx)(p.default, {
              variant: "caption",
              style: _.muted,
              children: xe.length
            })]
          }), (0, A.jsx)(f.default, {
            style: _.trophyRow,
            children: xe.map(e => (0, A.jsxs)(s.default, {
              style: _.trophy,
              accessibilityRole: "button",
              accessibilityLabel: `\u0422\u0440\u043e\u0444\u0435\u0439 ${e.name}`,
              onPress: () => le(e),
              children: [(0, A.jsx)(w.default, {
                design: "2026",
                def: e,
                size: 52
              }), (0, A.jsx)(p.default, {
                variant: "caption",
                style: _.trophyName,
                children: e.name
              })]
            }, e.id))
          })]
        })]
      }), (0, A.jsx)(n.default, {
        visible: ie,
        transparent: !0,
        animationType: "none",
        onRequestClose: () => re(!1),
        children: ie && (0, A.jsx)(j.default, {
          design: "2026",
          onClose: () => re(!1),
          children: (0, A.jsxs)(f.default, {
            style: _.menuBody,
            children: [(0, A.jsxs)(f.default, {
              style: _.menuRow,
              children: [(0, A.jsx)(R.Icon, {
                name: "bell",
                size: 24,
                color: I.DesignColors.text
              }), (0, A.jsx)(p.default, {
                style: _.menuLabel,
                children: "\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f"
              }), (0, A.jsx)(u.default, {
                accessibilityLabel: "\u0443\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043e \u0441\u043e\u0431\u044b\u0442\u0438\u044f\u0445 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440\u0430",
                value: ce,
                onValueChange: ue,
                trackColor: {
                  false: I.DesignColors.border,
                  true: I.DesignColors.text
                },
                thumbColor: I.DesignColors.background
              })]
            }), (0, A.jsxs)(s.default, {
              style: [_.menuRow, _.complaintRow],
              accessibilityRole: "button",
              accessibilityLabel: "\u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f",
              onPress: () => {
                re(!1), te(!0);
              },
              children: [(0, A.jsx)(v.Feather, {
                name: "alert-circle",
                size: 24,
                color: I.DesignColors.danger
              }), (0, A.jsx)(p.default, {
                style: [_.menuLabel, {
                  color: I.DesignColors.danger
                }],
                children: "\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f"
              })]
            })]
          })
        })
      }), (0, A.jsx)(n.default, {
        visible: oe,
        transparent: !0,
        animationType: "none",
        onRequestClose: () => de(!1),
        children: oe && (0, A.jsx)(j.default, {
          design: "2026",
          title: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u043F\u0440\u043E\u0444\u0438\u043B\u0435\u043C",
          onClose: () => de(!1),
          children: (0, A.jsxs)(f.default, {
            style: _.qrBody,
            children: [(0, A.jsx)(f.default, {
              style: _.qrPaper,
              children: (0, A.jsx)(C.default, {
                value: (0, T.organizerProfileLink)(F),
                size: 200,
                color: "#000000",
                backgroundColor: "#ffffff"
              })
            }), (0, A.jsx)(p.default, {
              variant: "label",
              children: O.name
            }), !!ne && (0, A.jsx)(p.default, {
              variant: "caption",
              accessibilityRole: "alert",
              style: _.muted,
              children: ne
            }), (0, A.jsx)(x.default, {
              label: "Скопировать ссылку",
              accessibilityLabel: "скопировать ссылку на профиль",
              style: {
                alignSelf: "stretch",
                marginTop: 4
              },
              onPress: ye
            })]
          })
        })
      }), (0, A.jsx)(n.default, {
        visible: !!ae,
        transparent: !0,
        animationType: "fade",
        onRequestClose: () => le(null),
        children: (0, A.jsx)(s.default, {
          accessibilityLabel: "\u0437\u0430\u043a\u0440\u044b\u0442\u044c \u0442\u0440\u043e\u0444\u0435\u0439",
          style: _.backdrop,
          onPress: () => le(null),
          children: (0, A.jsx)(s.default, {
            style: _.badgeDialog,
            onPress: e => e.stopPropagation(),
            children: ae && (0, A.jsxs)(A.Fragment, {
              children: [(0, A.jsx)(w.default, {
                design: "2026",
                def: ae,
                size: 72
              }), (0, A.jsx)(p.default, {
                variant: "sectionTitle",
                children: ae.name
              }), (0, A.jsx)(p.default, {
                variant: "caption",
                style: [_.muted, {
                  textAlign: 'center'
                }],
                children: ae.description
              }), (0, A.jsx)(x.default, {
                label: "\u041f\u043e\u043d\u044f\u0442\u043d\u043e",
                variant: "secondary",
                onPress: () => le(null)
              })]
            })
          })
        })
      }), (0, A.jsx)(P.default, {
        visible: ee,
        onClose: () => te(!1),
        target: "profile",
        targetId: F,
        personId: M !== F ? F : null,
        personName: O.name || void 0,
        onBlocked: K
      })]
    });
  }
  const _ = c.default.create({
    screen: {
      flex: 1,
      backgroundColor: I.DesignColors.background
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingBack: {
      position: 'absolute',
      left: 24,
      top: 16
    },
    content: {
      paddingHorizontal: 24,
      gap: 22
    },
    muted: {
      color: I.DesignColors.textSecondary
    },
    profileActions: {
      flexDirection: 'row',
      gap: 10
    },
    followButton: {
      flex: 1,
      paddingHorizontal: 12
    },
    actionIcon: {
      flex: 0,
      minWidth: 52,
      minHeight: 52,
      borderRadius: I.DesignShape.pill,
      borderWidth: 1,
      borderColor: I.DesignColors.fieldBorder,
      alignItems: 'center',
      justifyContent: 'center',
      width: 52
    },
    menuBody: {
      paddingBottom: 16
    },
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      minHeight: 64,
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: I.DesignColors.border
    },
    menuLabel: {
      flex: 1
    },
    complaintRow: {
      borderBottomWidth: 0,
      marginTop: 8
    },
    qrBody: {
      alignItems: 'center',
      gap: 18,
      paddingBottom: 32
    },
    qrPaper: {
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 20
    },
    verified: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginRight: 8
    },
    stats: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: I.DesignColors.border,
      borderRadius: I.DesignShape.card,
      backgroundColor: I.DesignColors.surface,
      paddingVertical: 16
    },
    stat: {
      flex: 1,
      alignItems: 'center',
      gap: 4
    },
    statLabel: {
      fontSize: 10,
      lineHeight: 14,
      textAlign: 'center'
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12
    },
    empty: {
      padding: 24,
      alignItems: 'center',
      gap: 12,
      borderRadius: I.DesignShape.card,
      backgroundColor: I.DesignColors.surface
    },
    trophies: {
      padding: 20,
      borderRadius: I.DesignShape.card,
      backgroundColor: I.DesignColors.surface,
      gap: 20
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    trophyRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 12
    },
    trophy: {
      flex: 1,
      alignItems: 'center',
      gap: 10,
      minHeight: 82
    },
    trophyName: {
      textAlign: 'center'
    },
    report: {
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center'
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.65)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    },
    badgeDialog: {
      width: '100%',
      maxWidth: 360,
      borderRadius: I.DesignShape.card,
      padding: 24,
      gap: 18,
      alignItems: 'center',
      backgroundColor: I.DesignColors.surface,
      borderWidth: 1,
      borderColor: I.DesignColors.border
    }
  });
};
