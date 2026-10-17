function (g, r, _i, a, m, _e, d) {
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
      return S;
    }
  });
  var t = e(r(d[0])),
    n = e(r(d[1])),
    l = e(r(d[2])),
    i = r(d[3]),
    s = e(r(d[4])),
    o = e(r(d[5])),
    c = e(r(d[6])),
    u = e(r(d[7])),
    f = e(r(d[8])),
    h = e(r(d[9])),
    y = r(d[10]),
    x = e(r(d[11])),
    b = r(d[12]),
    p = r(d[13]),
    j = r(d[14]),
    v = r(d[15]),
    w = r(d[16]),
    C = r(d[17]),
    k = r(d[18]);
  function S({
    route: e,
    navigation: l
  }) {
    const {
        sectionKey: o
      } = e.params,
      c = (0, C.useGoBack)(),
      v = (0, i.useSafeAreaInsets)(),
      w = (0, y.useColumnContent)(),
      {
        sections: S,
        loading: P,
        failed: B,
        refresh: _
      } = (0, j.useHomeSections)(),
      L = S.find(e => e.key === o),
      O = L?.events[0];
    return (0, k.jsxs)(t.default, {
      style: [I.screen, {
        paddingTop: v.top
      }],
      children: [(0, k.jsx)(t.default, {
        style: y.columnContent,
        children: (0, k.jsx)(h.default, {
          design: "2026",
          title: L?.title ?? '\u041f\u043e\u0434\u0431\u043e\u0440\u043a\u0430',
          onBack: c
        })
      }), P ? (0, k.jsx)(t.default, {
        style: [I.body, w],
        accessibilityLabel: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043f\u043e\u0434\u0431\u043e\u0440\u043a\u0443",
        children: Array.from({
          length: 4
        }).map((e, t) => (0, k.jsx)(b.SkeletonEventRow, {}, t))
      }) : B ? (0, k.jsx)(f.default, {
        title: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u043e\u0434\u0431\u043e\u0440\u043a\u0443",
        onRetry: () => {
          _();
        }
      }) : L ? (0, k.jsx)(n.default, {
        data: L.events,
        keyExtractor: e => e.id,
        showsVerticalScrollIndicator: !1,
        contentContainerStyle: [I.body, w, {
          paddingBottom: v.bottom + 24
        }],
        ListHeaderComponent: (0, k.jsxs)(t.default, {
          style: I.hero,
          children: [!!O && (0, k.jsx)(t.default, {
            style: I.cover,
            children: (0, k.jsx)(x.default, {
              design: "2026",
              palette: O.palette,
              imageUri: O.imageUri,
              image: (0, p.eventImage)(O),
              height: 180
            })
          }), (0, k.jsxs)(s.default, {
            variant: "body",
            style: I.meta,
            children: [L.tagline, " \xb7 ", L.events.length]
          })]
        }),
        renderItem: ({
          item: e
        }) => (0, k.jsx)(D, {
          event: e,
          onPress: () => l.navigate('EventDetail', {
            eventId: e.id
          })
        })
      }) : (0, k.jsxs)(t.default, {
        style: [I.empty, w],
        children: [(0, k.jsx)(s.default, {
          variant: "sectionTitle",
          children: "\u0412 \u043f\u043e\u0434\u0431\u043e\u0440\u043a\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0441\u043e\u0431\u044b\u0442\u0438\u0439"
        }), (0, k.jsx)(s.default, {
          variant: "body",
          style: I.meta,
          children: "\u0417\u0430\u0433\u043b\u044f\u043d\u0438\u0442\u0435 \u043f\u043e\u0437\u0436\u0435 \u0438\u043b\u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u0443\u044e \u0442\u0435\u043c\u0443 \u043d\u0430 \u0433\u043b\u0430\u0432\u043d\u043e\u0439."
        }), (0, k.jsx)(u.default, {
          label: "\u041d\u0430\u0437\u0430\u0434",
          variant: "secondary",
          onPress: c
        })]
      })]
    });
  }
  function D({
    event: e,
    onPress: n
  }) {
    const {
      saved: l,
      toggle: i
    } = (0, v.useSaved)(e.id);
    return (0, k.jsxs)(t.default, {
      style: I.row,
      children: [(0, k.jsxs)(o.default, {
        style: I.rowMain,
        onPress: n,
        accessibilityLabel: e.title,
        children: [(0, k.jsx)(t.default, {
          style: I.thumb,
          children: (0, k.jsx)(x.default, {
            design: "2026",
            palette: e.palette,
            imageUri: e.imageUri,
            image: (0, p.eventImage)(e),
            height: 80,
            width: 64
          })
        }), (0, k.jsxs)(t.default, {
          style: I.rowBody,
          children: [(0, k.jsx)(s.default, {
            variant: "label",
            numberOfLines: 3,
            children: e.title
          }), (0, k.jsxs)(s.default, {
            variant: "caption",
            style: I.meta,
            children: [e.day, ", ", e.num, e.month ? ` ${e.month}` : '', " \xb7 ", e.time]
          }), (0, k.jsx)(s.default, {
            variant: "caption",
            style: I.meta,
            numberOfLines: 2,
            children: e.place
          }), (0, k.jsx)(s.default, {
            variant: "label",
            children: e.price
          })]
        })]
      }), (0, k.jsx)(t.default, {
        style: {
          alignSelf: 'flex-end'
        },
        children: (0, k.jsx)(c.default, {
          icon: "heart",
          selected: l,
          onPress: i,
          label: l ? `\u0443\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e\u0433\u043e: ${e.title}` : `\u0432 \u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e\u0435: ${e.title}`
        })
      })]
    });
  }
  const I = l.default.create({
    screen: {
      flex: 1,
      backgroundColor: w.DesignColors.background
    },
    body: {
      padding: 24,
      gap: 16
    },
    empty: {
      padding: 24,
      gap: 24
    },
    hero: {
      gap: 16,
      marginBottom: 8
    },
    cover: {
      borderRadius: 24,
      overflow: 'hidden'
    },
    row: {
      padding: 12,
      gap: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: w.DesignColors.border,
      backgroundColor: w.DesignColors.surface
    },
    rowMain: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12
    },
    thumb: {
      width: 64,
      height: 80,
      borderRadius: 16,
      overflow: 'hidden'
    },
    rowBody: {
      flex: 1,
      minWidth: 0,
      gap: 6
    },
    meta: Object.assign({}, w.DesignTypography.caption, {
      color: w.DesignColors.textSecondary
    })
  });
}