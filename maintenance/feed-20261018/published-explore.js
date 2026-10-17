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
      return _;
    }
  });
  var t = r(d[0]),
    n = e(r(d[1])),
    l = e(r(d[2])),
    s = e(r(d[3])),
    o = e(r(d[4]));
  r(d[5]);
  var c = e(r(d[6])),
    u = e(r(d[7])),
    f = e(r(d[8])),
    h = e(r(d[9])),
    y = e(r(d[10])),
    x = e(r(d[11])),
    p = r(d[12]),
    b = r(d[13]),
    j = e(r(d[14])),
    v = e(r(d[15])),
    S = e(r(d[16])),
    z = e(r(d[17])),
    C = r(d[18]),
    R = e(r(d[19])),
    I = e(r(d[20])),
    w = e(r(d[21])),
    D = e(r(d[22])),
    k = r(d[23]),
    E = r(d[24]),
    P = r(d[25]),
    T = r(d[26]),
    B = r(d[27]),
    H = r(d[28]),
    L = r(d[29]),
    M = r(d[30]),
    O = r(d[31]),
    F = r(d[32]),
    N = r(d[33]);
  const A = O.palettes.dark,
    V = ['rgba(10,10,10,0.55)', 'rgba(10,10,10,0)', 'rgba(10,10,10,0.72)', 'rgba(10,10,10,0.97)'],
    $ = [0, .26, .58, 1],
    G = {
      itemVisiblePercentThreshold: 55,
      minimumViewTime: 60
    },
    W = 'svoifeed',
    U = {
      dataSet: {
        [W]: ''
      }
    };
  if ('undefined' != typeof document) {
    const e = 'svoi-feed-snap';
    if (!document.getElementById(e)) {
      const t = document.createElement('style');
      t.id = e, t.textContent = `[data-${W}] { overflow-anchor: none; }\n      [data-${W}] * { scroll-snap-stop: always; }`, document.head.appendChild(t);
    }
  }
  function _() {
    const e = (0, p.useNavigation)(),
      {
        events: l,
        loading: s,
        failed: f,
        refreshing: h,
        refresh: y
      } = (0, B.useFeed)(),
      [b, S] = (0, t.useState)(0),
      z = (0, t.useRef)(null),
      C = (0, t.useRef)(null),
      R = (0, t.useMemo)(() => l.map(e => e.id), [l]);
    (0, p.useFocusEffect)((0, t.useCallback)(() => {
      if (!C.current || b <= 0) return;
      const e = R.indexOf(C.current);
      if (e < 0) return void (C.current = null);
      const t = requestAnimationFrame(() => {
        z.current?.scrollToOffset({
          offset: e * b,
          animated: !1
        });
      });
      return () => cancelAnimationFrame(t);
    }, [R, b]));
    const I = (0, H.useGoingMap)(R),
      [w, D] = (0, t.useState)(null),
      k = (0, t.useRef)(({
        viewableItems: e
      }) => {
        const t = e[0]?.item;
        t && D(t.id);
      }).current;
    return (0, t.useEffect)(() => {
      D(e => e && R.includes(e) ? e : R[0] ?? null);
    }, [R]), (0, N.jsx)(j.default, {
      background: "bg",
      edges: [],
      children: (0, N.jsx)(x.default, {
        style: Y.feed,
        onLayout: e => {
          const t = e.nativeEvent.layout.height;
          t > 0 && S(t);
        },
        children: s ? (0, N.jsx)(x.default, {
          style: Y.center,
          children: (0, N.jsx)(n.default, {
            color: A.accent
          })
        }) : 0 === l.length ? (0, N.jsxs)(x.default, {
          style: Y.center,
          children: [(0, N.jsx)(P.Icon, {
            name: f ? 'offline' : 'lens',
            size: O.IconSize.lg,
            color: A.gray4
          }), (0, N.jsx)(v.default, {
            style: Y.emptyTitle,
            children: f ? '\u041d\u0435 \u0434\u043e\u0442\u044f\u043d\u0443\u043b\u0438\u0441\u044c' : '\u0421\u0435\u0433\u043e\u0434\u043d\u044f \u0440\u044f\u0434\u043e\u043c \u0442\u0438\u0445\u043e'
          }), (0, N.jsx)(v.default, {
            style: Y.emptyText,
            children: f ? '\u0421\u0432\u044f\u0437\u044c \u043f\u0440\u043e\u043f\u0430\u043b\u0430. \u041a\u0430\u043a \u0442\u043e\u043b\u044c\u043a\u043e \u0432\u0435\u0440\u043d\u0451\u0442\u0441\u044f \u2014 \u0441\u043e\u0431\u0435\u0440\u0451\u043c \u0430\u0444\u0438\u0448\u0443 \u0437\u0430\u043d\u043e\u0432\u043e.' : '\u0412 \u044d\u0442\u043e\u043c \u0440\u0430\u0439\u043e\u043d\u0435 \u0441\u0435\u0433\u043e\u0434\u043d\u044f \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435\u0442. \u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0437\u0430\u0432\u0442\u0440\u0430 \u0438\u043b\u0438 \u0440\u044f\u0434\u043e\u043c.'
          }), f && (0, N.jsx)(c.default, {
            style: ({
              pressed: e
            }) => [Y.emptyCta, e && O.PRESSED],
            onPress: y,
            accessibilityRole: "button",
            accessibilityLabel: "\u0435\u0449\u0451 \u0440\u0430\u0437",
            children: (0, N.jsx)(v.default, {
              style: Y.emptyCtaText,
              children: "\u0435\u0449\u0451 \u0440\u0430\u0437"
            })
          })]
        }) : b > 0 && (0, N.jsx)(o.default, Object.assign({}, U, {
          ref: z,
          onScrollBeginDrag: () => {
            C.current = null;
          },
          data: l,
          keyExtractor: e => e.id,
          pagingEnabled: !0,
          showsVerticalScrollIndicator: !1,
          snapToInterval: b,
          snapToAlignment: "start",
          decelerationRate: "fast",
          disableIntervalMomentum: !0,
          onViewableItemsChanged: k,
          viewabilityConfig: G,
          getItemLayout: (e, t) => ({
            length: b,
            offset: b * t,
            index: t
          }),
          refreshControl: (0, N.jsx)(u.default, {
            refreshing: h,
            onRefresh: y,
            tintColor: A.gray4
          }),
          renderItem: ({
            item: t
          }) => (0, N.jsx)(q, {
            event: t,
            knownGoing: I.has(t.id),
            height: b,
            active: t.id === w,
            onOpen: () => {
              C.current = t.id, e.navigate('EventDetail', {
                eventId: t.id
              });
            },
            onWentGoing: () => {
              C.current = t.id, e.navigate('Purchase', {
                eventId: t.id
              });
            }
          })
        }))
      })
    });
  }
  function q({
    event: e,
    knownGoing: n,
    height: o,
    active: u,
    onOpen: j,
    onWentGoing: G
  }) {
    const {
        going: W
      } = (0, H.useGoing)(e.id, n),
      {
        saved: U,
        toggle: _
      } = (0, L.useSaved)(e.id),
      q = (0, C.useEdge)(),
      J = (0, p.useNavigation)(),
      [K, Q] = (0, t.useState)(!1),
      {
        detail: X
      } = (0, B.useEvent)(u ? e.id : ''),
      Z = (0, E.eventPosterContent)(X ?? e),
      ee = X?.organizer;
    (0, t.useEffect)(() => {
      u || Q(!1);
    }, [u]);
    const te = () => {
        ee && J.navigate('OrganizerProfile', {
          organizerId: ee.id
        });
      },
      ne = (0, M.isLiveNow)(e.startsAt, e.endsAt),
      ie = (0, F.useReduceMotion)(),
      ae = (0, t.useRef)(new l.default.Value(u ? 1 : 0)).current;
    (0, t.useEffect)(() => {
      ie ? ae.setValue(u ? 1 : 0) : l.default.timing(ae, {
        toValue: u ? 1 : 0,
        duration: O.Motion.base,
        easing: s.default.bezier(...O.Motion.easeOut),
        useNativeDriver: !0
      }).start();
    }, [u, ie, ae]);
    const le = {
      opacity: ae.interpolate({
        inputRange: [0, 1],
        outputRange: [.45, 1]
      }),
      transform: [{
        translateY: ae.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0]
        })
      }]
    };
    return (0, N.jsxs)(x.default, {
      style: [Y.page, {
        height: o
      }],
      accessibilityElementsHidden: !u,
      importantForAccessibility: u ? 'auto' : 'no-hide-descendants',
      children: [(0, N.jsx)(c.default, {
        style: y.default.absoluteFill,
        onPress: j,
        accessibilityRole: "button",
        accessibilityLabel: `\u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u043e\u0431\u044b\u0442\u0438\u0435: ${e.title}`,
        children: (0, N.jsx)(R.default, {
          palette: e.palette,
          imageUri: e.imageUri,
          image: (0, T.eventImage)(e),
          height: o
        })
      }), (0, N.jsx)(b.LinearGradient, {
        colors: V,
        locations: $,
        style: y.default.absoluteFill,
        pointerEvents: "none"
      }), (0, N.jsx)(x.default, {
        style: Y.topBar,
        children: (0, N.jsx)(z.default, {
          style: Y.topRow,
          children: ne && (0, N.jsxs)(x.default, {
            style: Y.status,
            children: [(0, N.jsx)(x.default, {
              style: Y.statusDot
            }), (0, N.jsx)(v.default, {
              style: Y.statusText,
              children: "\u0441\u0435\u0439\u0447\u0430\u0441"
            })]
          })
        })
      }), (0, N.jsx)(l.default.View, {
        style: le,
        children: (0, N.jsxs)(z.default, {
          style: [Y.bottom, q],
          children: [(0, N.jsx)(c.default, {
            onPress: j,
            style: ({
              pressed: e
            }) => e && O.PRESSED,
            accessibilityRole: "button",
            accessibilityLabel: e.title,
            children: (0, N.jsx)(v.default, {
              style: Y.title,
              children: e.title
            })
          }), (0, N.jsx)(x.default, {
            style: Y.organizerAndInfo,
            children: (0, N.jsxs)(c.default, {
              style: Y.organizerLink,
              disabled: !ee,
              onPress: te,
              accessibilityRole: ee ? 'button' : void 0,
              accessibilityLabel: `\u043f\u0440\u043e\u0444\u0438\u043b\u044c \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440\u0430: ${Z.organizerName}`,
              children: [(0, N.jsx)(S.default, {
                name: Z.organizerName,
                initials: ee?.initials ?? Z.organizerInitials,
                avatarUrl: ee?.avatarUrl,
                size: 32,
                design: "2026"
              }), (0, N.jsx)(v.default, {
                style: Y.organizerName,
                numberOfLines: 1,
                children: Z.organizerName
              })]
            })
          }), (0, N.jsx)(c.default, {
            style: ({
              pressed: e
            }) => [Y.descriptionPreview, e && O.PRESSED],
            onPress: () => Q(!0),
            accessibilityRole: "button",
            accessibilityLabel: `\u0440\u0430\u0441\u043a\u0440\u044b\u0442\u044c \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435: ${e.title}`,
            children: (0, N.jsx)(v.default, {
              style: Y.descriptionMore,
              children: "\u0435\u0449\u0451"
            })
          }), (0, N.jsxs)(x.default, {
            style: Y.actions,
            children: [(0, N.jsx)(x.default, {
              style: Y.goSlot,
              children: (0, N.jsx)(I.default, {
                label: W ? "\u0411\u0438\u043b\u0435\u0442 \u0443 \u0432\u0430\u0441" : "\u0418\u0434\u0443",
                detail: e.price,
                variant: W ? "secondary" : "primary",
                onPress: () => W ? j() : G()
              })
            }), (0, N.jsx)(c.default, {
              style: ({
                pressed: e
              }) => [Y.like, U && Y.likeOn, e && O.PRESSED],
              onPress: _,
              accessibilityRole: "button",
              accessibilityState: {
                selected: U
              },
              accessibilityLabel: U ? `\u0443\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e\u0433\u043e: ${e.title}` : `\u0432 \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e\u0435: ${e.title}`,
              children: (0, N.jsx)(P.Icon, {
                name: "heart",
                size: O.IconSize.lg,
                color: U ? A.onAccent : A.gray1
              })
            })]
          })]
        })
      }), (0, N.jsx)(f.default, {
        visible: K,
        transparent: !0,
        animationType: "none",
        onRequestClose: () => Q(!1),
        children: K && (0, N.jsx)(D.default, {
          design: "2026",
          onClose: () => Q(!1),
          children: (0, N.jsxs)(h.default, {
            style: {
              maxHeight: .7 * o
            },
            contentContainerStyle: Y.sheetContent,
            showsVerticalScrollIndicator: !1,
            children: [(0, N.jsx)(x.default, {
              style: Y.sheetHandle
            }), (0, N.jsx)(w.default, {
              variant: "sectionTitle",
              children: e.title
            }), (0, N.jsxs)(c.default, {
              style: Y.sheetOrganizer,
              disabled: !ee,
              onPress: () => {
                Q(!1), te();
              },
              accessibilityRole: ee ? 'button' : void 0,
              accessibilityLabel: `\u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440: ${Z.organizerName}`,
              children: [(0, N.jsx)(S.default, {
                name: Z.organizerName,
                initials: ee?.initials ?? Z.organizerInitials,
                avatarUrl: ee?.avatarUrl,
                size: 40,
                design: "2026"
              }), (0, N.jsxs)(x.default, {
                style: {
                  flex: 1,
                  gap: 3
                },
                children: [(0, N.jsx)(w.default, {
                  variant: "caption",
                  style: {
                    color: k.DesignColors.textSecondary
                  },
                  children: "\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440"
                }), (0, N.jsx)(w.default, {
                  variant: "label",
                  children: Z.organizerName
                })]
              })]
            }), (0, N.jsx)(x.default, {
              style: Y.sheetRule
            }), (0, N.jsxs)(x.default, {
              style: Y.sheetMeta,
              children: [(0, N.jsx)(P.Icon, {
                name: "cal",
                size: 20,
                color: k.DesignColors.textSecondary
              }), (0, N.jsxs)(w.default, {
                style: {
                  flex: 1
                },
                children: [e.day, ", ", e.num, e.month ? ` ${e.month}` : '', " \xb7 ", e.time]
              })]
            }), (0, N.jsxs)(x.default, {
              style: Y.sheetMeta,
              children: [(0, N.jsx)(P.Icon, {
                name: "pin",
                size: 20,
                color: k.DesignColors.textSecondary
              }), (0, N.jsx)(w.default, {
                style: {
                  flex: 1
                },
                children: [e.city, e.place].filter(Boolean).join(' \xb7 ')
              })]
            }), (0, N.jsx)(x.default, {
              style: Y.sheetRule
            }), (0, N.jsx)(w.default, {
              variant: "label",
              children: "\u041e \u0441\u043e\u0431\u044b\u0442\u0438\u0438"
            }), (0, N.jsx)(w.default, {
              style: {
                color: k.DesignColors.textSecondary,
                lineHeight: 24
              },
              children: Z.description
            })]
          })
        })
      })]
    });
  }
  const Y = y.default.create({
    feed: {
      flex: 1,
      backgroundColor: A.bg
    },
    page: {
      justifyContent: 'flex-end'
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      paddingHorizontal: O.Spacing.xxl
    },
    emptyTitle: {
      fontFamily: O.Fonts.displayBold,
      fontSize: 24,
      letterSpacing: -.5,
      color: A.gray1
    },
    emptyText: {
      fontSize: 15,
      lineHeight: 23,
      color: A.gray4,
      textAlign: 'center'
    },
    emptyCta: {
      height: O.Layout.controlMd,
      paddingHorizontal: 22,
      borderRadius: O.Radius.pill,
      backgroundColor: 'rgba(244,240,232,0.08)',
      borderWidth: 1,
      borderColor: O.Border.subtleDark,
      justifyContent: 'center'
    },
    emptyCtaText: {
      fontSize: 15,
      fontWeight: '600',
      color: A.gray1
    },
    topBar: {
      position: 'absolute',
      top: O.Spacing.huge,
      left: O.Spacing.xl,
      right: O.Spacing.xl
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: O.Spacing.sm,
      height: 26,
      paddingHorizontal: 11,
      borderRadius: O.Radius.full,
      backgroundColor: A.accentSoft
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: A.accent
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: A.accent
    },
    bottom: {
      paddingHorizontal: O.Spacing.xl,
      paddingBottom: O.Spacing.md,
      gap: 12
    },
    title: {
      fontFamily: O.Fonts.displayBold,
      fontSize: 34,
      lineHeight: 40,
      letterSpacing: 0,
      color: A.gray1
    },
    organizerAndInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    organizerLink: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 44
    },
    organizerName: {
      flex: 1,
      fontSize: 14,
      color: A.gray1
    },
    descriptionPreview: {
      minHeight: 32,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      paddingRight: 20,
      marginTop: -8
    },
    descriptionMore: {
      fontSize: 14,
      lineHeight: 20,
      color: A.gray1,
      fontFamily: O.Fonts.bodySemiBold
    },
    sheetContent: {
      gap: 18,
      paddingTop: 12,
      paddingBottom: 24
    },
    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      backgroundColor: k.DesignColors.textSecondary,
      marginBottom: 2
    },
    sheetOrganizer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 48
    },
    sheetRule: {
      height: 1,
      backgroundColor: k.DesignColors.border
    },
    sheetMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingTop: 2
    },
    goSlot: {
      flex: 1
    },
    like: {
      width: O.Sizes.goButton.lg,
      height: O.Sizes.goButton.lg,
      borderRadius: O.Radius.full,
      backgroundColor: 'rgba(244,240,232,0.10)',
      borderWidth: 1,
      borderColor: O.Border.strongDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    likeOn: {
      backgroundColor: A.accent,
      borderColor: A.accent
    }
  });
}
