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
      return q;
    }
  });
  var t = r(d[0]),
    n = r(d[1]),
    s = e(r(d[2])),
    l = e(r(d[3])),
    o = e(r(d[4])),
    c = e(r(d[5])),
    u = e(r(d[6])),
    f = e(r(d[7])),
    p = e(r(d[8])),
    h = r(d[9]),
    x = r(d[10]),
    y = e(r(d[11])),
    b = r(d[12]),
    j = r(d[13]),
    D = e(r(d[14])),
    v = e(r(d[15])),
    S = e(r(d[16])),
    C = e(r(d[17])),
    I = r(d[18]),
    z = e(r(d[19])),
    R = e(r(d[20])),
    k = r(d[21]),
    P = e(k),
    w = r(d[22]),
    E = e(r(d[23])),
    B = r(d[24]),
    L = r(d[25]),
    $ = r(d[26]),
    G = r(d[27]),
    H = r(d[28]),
    T = r(d[29]),
    N = r(d[30]),
    A = r(d[31]),
    M = r(d[32]),
    W = r(d[33]),
    _ = r(d[34]),
    U = r(d[35]),
    F = r(d[36]),
    O = r(d[37]);
  const V = 390;
  function q({
    route: e,
    navigation: k
  }) {
    const q = (0, I.useEdge)(),
      J = (0, F.useGoBack)(),
      {
        eventId: K
      } = e.params,
      {
        detail: Q,
        loading: X
      } = (0, $.useEvent)(K),
      Y = (0, x.useSafeAreaInsets)(),
      {
        height: ee
      } = (0, p.default)(),
      [te, ie] = (0, t.useState)(0),
      ne = Math.max(V, (te || ee) - Y.top),
      {
        userId: se
      } = (0, N.useAuth)(),
      {
        mode: ae
      } = (0, A.useMode)(),
      {
        profile: le
      } = (0, $.useProfile)(),
      [oe, re] = (0, t.useState)(!1),
      {
        tickets: de,
        loading: ce,
        reload: ge
      } = (0, $.useTickets)(Q?.id ?? ''),
      ue = (0, t.useRef)(ge);
    ue.current = ge;
    const fe = (0, t.useRef)(!1);
    (0, n.useFocusEffect)((0, t.useCallback)(() => (fe.current && ue.current(), () => {
      fe.current = !0;
    }), []));
    const pe = de.length > 0 && de.every(e => !e.unlimited && (e.qty ?? 0) <= 0),
      he = (0, t.useRef)(null),
      {
        tickets: me,
        loading: xe
      } = (0, G.useMyTickets)(),
      ye = me.find(e => e.eventId === (Q?.id ?? '')),
      {
        saved: be,
        toggle: je
      } = (0, M.useSaved)(Q?.id ?? '');
    if ((0, t.useEffect)(() => {
      Q?.id && se && (0, W.recordMetricEventOpen)(Q.id, se).catch(() => {});
    }, [Q?.id, se]), !Q) return (0, O.jsx)(s.default, {
      style: [Z.screen, Z.center],
      children: X ? (0, O.jsx)(f.default, {
        color: U.DesignColors.actionPrimary,
        size: "large",
        accessibilityLabel: "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u044f"
      }) : (0, O.jsxs)(O.Fragment, {
        children: [(0, O.jsx)(D.default, {
          variant: "sectionTitle",
          children: "\u0421\u043e\u0431\u044b\u0442\u0438\u0435 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e"
        }), (0, O.jsx)(v.default, {
          label: "\u041d\u0430\u0437\u0430\u0434",
          variant: "secondary",
          onPress: J
        })]
      })
    });
    const De = (0, b.eventPosterContent)(Q),
      ve = !Q.priceMin,
      Se = (0, T.isLiveNow)(Q.startsAt, Q.endsAt),
      Ce = (0, T.hasEnded)(Q.startsAt, Q.endsAt),
      Ie = !!se && Q.authorId === se,
      ze = Ce && (!0 === e.params.archivePreview || 'org' === ae && Ie),
      Re = !!ye,
      ke = !Re && (Ce || pe);
    return (0, O.jsxs)(s.default, {
      style: Z.screen,
      children: [(0, O.jsx)(l.default, {
        showsVerticalScrollIndicator: !1,
        contentContainerStyle: Z.scroll,
        onLayout: ({
          nativeEvent: e
        }) => ie(e.layout.height),
        children: (0, O.jsxs)(C.default, {
          max: 720,
          children: [(0, O.jsxs)(s.default, {
            style: [Z.hero, {
              marginTop: Y.top,
              minHeight: ne
            }],
            children: [(0, O.jsx)(s.default, {
              style: u.default.absoluteFill,
              children: (0, O.jsx)(y.default, {
                design: "2026",
                palette: Q.palette,
                imageUri: Q.imageUri,
                image: (0, j.eventImage)(Q),
                height: ne
              })
            }), (0, O.jsx)(h.LinearGradient, {
              colors: [U.DesignColors.photoProtection, 'transparent', U.DesignColors.background],
              locations: [0, .35, 1],
              style: u.default.absoluteFill,
              pointerEvents: "none"
            }), (0, O.jsxs)(s.default, {
              style: [Z.heroBar, q],
              children: [(0, O.jsx)(S.default, {
                icon: "back",
                label: "\u043d\u0430\u0437\u0430\u0434",
                onPress: J,
                onPhoto: !0
              }), (0, O.jsx)(S.default, {
                icon: "share",
                label: "\u043f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f",
                onPress: () => (0, B.shareCard)(he, `\u0418\u0434\u0443 \u043d\u0430 \xab${Q.title}\xbb \u2014 ${Q.day} ${Q.num}. \u041f\u043e\u0433\u043d\u0430\u043b\u0438 \u0432\u043c\u0435\u0441\u0442\u0435?`, (0, L.eventLink)(Q.id, {
                  ref: se
                })),
                onPhoto: !0
              })]
            }), (0, O.jsxs)(s.default, {
              style: [Z.heroTitle, q],
              pointerEvents: "box-none",
              children: [(0, O.jsx)(D.default, {
                variant: "eventTitle",
                accessibilityRole: "header",
                style: Z.title,
                children: Q.title
              }), (0, O.jsxs)(s.default, {
                style: Z.dateRow,
                children: [(0, O.jsx)(w.Icon, {
                  name: "cal",
                  size: _.IconSize.md,
                  color: U.DesignColors.textSecondary
                }), (0, O.jsxs)(D.default, {
                  variant: "label",
                  style: Z.flex,
                  children: [[Q.day, [Q.num, Q.month].filter(Boolean).join(' ')].filter(Boolean).join(', '), " \xb7 ", Q.time]
                }), Se && (0, O.jsx)(D.default, {
                  variant: "caption",
                  style: Z.live,
                  children: "\u0421\u0435\u0439\u0447\u0430\u0441"
                })]
              })]
            })]
          }), (0, O.jsxs)(s.default, {
            style: [Z.body, q],
            children: [(0, O.jsx)(s.default, {
              style: Z.detailsDivider
            }), Q.totalGoing > 0 && (0, O.jsxs)(o.default, {
              style: ({
                pressed: e
              }) => [Z.people, e && _.PRESSED],
              onPress: () => k.navigate('Going', {
                eventId: Q.id
              }),
              accessibilityRole: "button",
              accessibilityLabel: `\u043a\u0442\u043e \u0438\u0434\u0451\u0442: ${Q.totalGoing} ${(0, H.personWord)(Q.totalGoing)}`,
              children: [(0, O.jsxs)(s.default, {
                style: Z.flex,
                children: [(0, O.jsx)(D.default, {
                  variant: "caption",
                  style: Z.peopleLabel,
                  children: "Кто идёт"
                }), (Q.friendsCount ?? 0) > 0 && (Q.friends?.length ?? 0) > 0 || Q.totalGoing >= 20 ? (0, O.jsx)(R.default, {
                  friends: Q.friends ?? [],
                  friendsCount: Q.friendsCount ?? 0,
                  totalGoing: Q.totalGoing,
                  size: "md",
                  ringColor: U.DesignColors.background,
                  design: "2026"
                }) : (0, O.jsxs)(D.default, {
                  variant: "label",
                  children: [Q.totalGoing, " ", (0, H.personWord)(Q.totalGoing), " ", (0, H.goingWord)(Q.totalGoing)]
                })]
              }), (0, O.jsx)(s.default, {
                style: Z.peopleArrow,
                children: (0, O.jsx)(w.Icon, {
                  name: "right",
                  size: _.IconSize.sm,
                  color: U.DesignColors.textSecondary
                })
              })]
            }), (0, O.jsxs)(s.default, {
              style: Z.infoRows,
              children: [Q.organizer ? (0, O.jsxs)(o.default, {
                style: ({
                  pressed: e
                }) => [Z.infoRow, Z.flex, e && _.PRESSED],
                onPress: () => k.navigate('OrganizerProfile', {
                  organizerId: Q.organizer.id
                }),
                accessibilityRole: "button",
                accessibilityLabel: `\u043f\u0440\u043e\u0444\u0438\u043b\u044c \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440\u0430: ${Q.organizer.name}`,
                children: [(0, O.jsx)(z.default, {
                  name: Q.organizer.name,
                  initials: Q.organizer.initials,
                  avatarUrl: Q.organizer.avatarUrl,
                  size: 40,
                  design: "2026"
                }), (0, O.jsxs)(s.default, {
                  style: Z.flex,
                  children: [(0, O.jsx)(D.default, {
                    variant: "caption",
                    style: Z.muted,
                    children: "\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440"
                  }), (0, O.jsx)(D.default, {
                    variant: "label",
                    style: Z.infoName,
                    children: Q.organizer.name
                  })]
                })]
              }) : (0, O.jsxs)(s.default, {
                style: [Z.infoRow, Z.flex],
                children: [(0, O.jsx)(z.default, {
                  name: De.organizerName,
                  initials: De.organizerInitials,
                  size: 40,
                  design: "2026"
                }), (0, O.jsxs)(s.default, {
                  style: Z.flex,
                  children: [(0, O.jsx)(D.default, {
                    variant: "caption",
                    style: Z.muted,
                    children: "\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440"
                  }), (0, O.jsx)(D.default, {
                    variant: "label",
                    style: Z.infoName,
                    children: De.organizerName
                  })]
                })]
              }), (0, O.jsxs)(o.default, {
                style: ({
                  pressed: e
                }) => [Z.infoRow, Z.flex, e && _.PRESSED],
                onPress: () => {
                  const e = [Q.city, Q.place].filter(Boolean).join(', ');
                  c.default.openURL(`https://yandex.ru/maps/?text=${encodeURIComponent(e)}`).catch(() => {});
                },
                accessibilityRole: "button",
                accessibilityLabel: `\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043d\u0430 \u043a\u0430\u0440\u0442\u0435: ${Q.place}`,
                children: [(0, O.jsx)(s.default, {
                  style: Z.placeIcon,
                  children: (0, O.jsx)(w.Icon, {
                    name: "pin",
                    size: _.IconSize.md,
                    color: U.DesignColors.text
                  })
                }), (0, O.jsxs)(s.default, {
                  style: Z.flex,
                  children: [(0, O.jsxs)(D.default, {
                    variant: "caption",
                    style: Z.muted,
                    children: ["\u041c\u0435\u0441\u0442\u043e", Q.city ? ` \xb7 ${Q.city}` : '']
                  }), (0, O.jsx)(D.default, {
                    variant: "label",
                    style: Z.infoName,
                    children: Q.place
                  })]
                })]
              })]
            }), Ie && Q.guestListEnabled && (0, O.jsx)(v.default, {
              label: "\u0413\u0435\u0441\u0442-\u043b\u0438\u0441\u0442",
              detail: "\u0411\u0438\u043b\u0435\u0442\u044b \u0438 \u0432\u0445\u043e\u0434",
              variant: "secondary",
              accessibilityLabel: "\u0433\u0435\u0441\u0442-\u043b\u0438\u0441\u0442 \u0441\u043e\u0431\u044b\u0442\u0438\u044f",
              onPress: () => k.navigate('GuestList', {
                eventId: Q.id
              })
            }), (0, O.jsx)(s.default, {
              style: Z.detailsDivider
            }), (0, O.jsxs)(s.default, {
              style: Z.descriptionBlock,
              children: [(0, O.jsx)(D.default, {
                variant: "label",
                children: "\u041e \u0441\u043e\u0431\u044b\u0442\u0438\u0438"
              }), (0, O.jsx)(D.default, {
                style: Z.description,
                children: De.description
              })]
            }), (0, O.jsx)(o.default, {
              style: ({
                pressed: e
              }) => [Z.report, e && _.PRESSED],
              onPress: () => re(!0),
              accessibilityRole: "button",
              accessibilityLabel: "\u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u0441\u043e\u0431\u044b\u0442\u0438\u0435",
              children: (0, O.jsx)(D.default, {
                variant: "caption",
                style: Z.muted,
                children: "\u041f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c\u0441\u044f"
              })
            }), (0, O.jsx)(s.default, {
              style: Z.tags,
              children: [Q.ageLimit].filter(Boolean).map((e, t) => (0, O.jsx)(s.default, {
                style: Z.tag,
                children: (0, O.jsx)(D.default, {
                  variant: "caption",
                  children: e
                })
              }, `${e}-${t}`))
            })]
          })]
        })
      }), (0, O.jsx)(E.default, {
        visible: oe,
        onClose: () => re(!1),
        target: "event",
        targetId: Q.id,
        personId: Q.organizer && Q.organizer.id !== se ? Q.organizer.id : null,
        personName: Q.organizer?.name
      }), (0, O.jsx)(s.default, {
        style: Z.offscreen,
        pointerEvents: "none",
        accessibilityElementsHidden: !0,
        importantForAccessibility: "no-hide-descendants",
        children: (0, O.jsx)(s.default, {
          ref: he,
          collapsable: !1,
          children: (0, O.jsx)(P.default, {
            kind: "event",
            title: Q.title,
            when: `${Q.day} ${Q.num} \xb7 ${Q.time}`,
            place: Q.place,
            palette: Q.palette,
            userName: le.name
          })
        })
      }), !ze && (0, O.jsx)(s.default, {
        style: [Z.bottomBar, {
          paddingBottom: Y.bottom + U.DesignSpace.md
        }],
        children: (0, O.jsxs)(C.default, {
          max: 720,
          style: [Z.bottom, q],
          children: [(0, O.jsx)(v.default, {
            style: [Z.flex, Z.primaryAction],
            label: Re ? '\u0411\u0438\u043b\u0435\u0442 \u0443 \u0432\u0430\u0441' : Ce ? '\u0421\u043e\u0431\u044b\u0442\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e' : pe ? '\u0420\u0430\u0441\u043f\u0440\u043e\u0434\u0430\u043d\u043e' : '\u0418\u0434\u0443',
            detail: Re || ke ? void 0 : ve ? '\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e' : Q.price,
            accessibilityLabel: Re ? '\u0431\u0438\u043b\u0435\u0442 \u0443 \u0432\u0430\u0441, \u043e\u0442\u043a\u0440\u044b\u0442\u044c' : ke ? Ce ? '\u0421\u043e\u0431\u044b\u0442\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e' : '\u0420\u0430\u0441\u043f\u0440\u043e\u0434\u0430\u043d\u043e' : '\u0438\u0434\u0443, \u0432\u0437\u044f\u0442\u044c \u0431\u0438\u043b\u0435\u0442',
            disabled: ke,
            loading: (ce || xe) && !Re && !Ce,
            onPress: () => {
              ye ? k.navigate('Ticket', {
                orderId: ye.id
              }) : k.navigate('Purchase', {
                eventId: Q.id
              });
            }
          }), (0, O.jsx)(PosterLike, {
            icon: "heart",
            selected: be,
            onPress: je,
            label: be ? '\u0443\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e' : '\u0432 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435'
          })]
        })
      })]
    });
  }
  const Z = u.default.create({
    screen: {
      flex: 1,
      backgroundColor: U.DesignColors.background
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: U.DesignSpace.lg,
      gap: U.DesignSpace.md
    },
    scroll: {
      paddingBottom: U.DesignSpace.md
    },
    hero: {
      minHeight: V,
      backgroundColor: U.DesignColors.background,
      justifyContent: 'flex-end'
    },
    heroBar: {
      position: 'absolute',
      zIndex: 1,
      top: U.DesignSpace.md,
      left: 0,
      right: 0,
      paddingHorizontal: U.DesignSpace.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    heroTitle: {
      paddingHorizontal: U.DesignSpace.lg,
      paddingTop: 170,
      paddingBottom: U.DesignSpace.md,
      gap: U.DesignSpace.md
    },
    title: {
      textTransform: 'uppercase'
    },
    detailsDivider: {
      height: U.DesignShape.stroke,
      backgroundColor: U.DesignColors.border,
      marginBottom: U.DesignSpace.sm
    },
    body: {
      paddingHorizontal: U.DesignSpace.lg,
      gap: U.DesignSpace.md
    },
    flex: {
      flex: 1,
      minWidth: 0
    },
    muted: {
      color: U.DesignColors.textSecondary
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: U.DesignSpace.sm
    },
    live: {
      color: U.DesignColors.success
    },
    people: {
      minHeight: 72,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: U.DesignColors.border,
      backgroundColor: U.DesignColors.surface
    },
    descriptionBlock: {
      gap: U.DesignSpace.sm
    },
    description: {
      color: U.DesignColors.textSecondary,
      fontSize: 16,
      lineHeight: 24
    },
    infoName: {
      fontSize: 15,
      lineHeight: 21
    },
    infoRows: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: U.DesignSpace.lg
    },
    infoRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: U.DesignSpace.sm,
      minHeight: 108,
      paddingVertical: U.DesignSpace.sm
    },
    placeIcon: {
      width: 40,
      height: 40,
      borderRadius: U.DesignShape.pill,
      backgroundColor: U.DesignColors.surfaceRaised,
      alignItems: 'center',
      justifyContent: 'center'
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: U.DesignSpace.sm
    },
    tag: {
      borderRadius: U.DesignShape.pill,
      borderWidth: U.DesignShape.stroke,
      borderColor: U.DesignColors.border,
      paddingHorizontal: U.DesignSpace.md,
      paddingVertical: U.DesignSpace.sm
    },
    report: {
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    offscreen: {
      position: 'absolute',
      left: -k.CARD_SIZE.width - 40,
      top: 0
    },
    bottomBar: {
      backgroundColor: U.DesignColors.background,
      borderTopWidth: U.DesignShape.stroke,
      borderTopColor: U.DesignColors.border,
      paddingTop: U.DesignSpace.md
    },
    bottom: {
      minHeight: 52,
      paddingHorizontal: U.DesignSpace.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: U.DesignSpace.sm
    },
    peopleLabel: {
      color: U.DesignColors.textSecondary,
      marginBottom: 4
    },
    peopleArrow: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: U.DesignColors.border
    },
    primaryAction: {
      minHeight: 44,
      paddingVertical: 8,
      paddingHorizontal: 16,
      flexDirection: "row",
      gap: 8
    }
  });
};
