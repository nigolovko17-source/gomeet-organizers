module.exports=function (g, r, i, a, m, _e, d) {
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
      return v;
    }
  });
  var o = e(r(d[0])),
    s = e(r(d[1])),
    l = e(r(d[2])),
    t = e(r(d[3])),
    n = e(r(d[4])),
    c = e(r(d[5])),
    u = e(r(d[6])),
    f = e(r(d[7])),
    b = e(r(d[8])),
    y = r(d[9]),
    p = r(d[10]),
    x = r(d[11]),
    h = r(d[12]),
    j = r(d[13]),
    C = r(d[14]),
    D = r(d[15]),
    L = r(d[16]);
  function v() {
    const e = (0, h.useGoBack)(),
      l = (0, x.useColumnContent)(),
      {
        userId: v
      } = (0, j.useAuth)(),
      T = (0, C.useDiagnosticsConsent)(v);
    return (0, L.jsxs)(n.default, {
      background: "bg",
      edges: ['top', 'bottom'],
      children: [(0, L.jsx)(t.default, {
        style: x.columnContent,
        children: (0, L.jsx)(c.default, {
          design: "2026",
          title: "\u041e \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438",
          onBack: e
        })
      }), (0, L.jsxs)(s.default, {
        contentContainerStyle: [l, w.content],
        children: [(0, L.jsxs)(t.default, {
          style: w.group,
          children: [(0, L.jsxs)(f.default, {
            style: w.row,
            accessibilityLabel: "\u041f\u0440\u0430\u0432\u0438\u043b\u0430 \u0441\u0435\u0440\u0432\u0438\u0441\u0430",
            onPress: () => o.default.openURL(D.LEGAL_URL.terms),
            children: [(0, L.jsx)(u.default, {
              style: w.label,
              children: "\u041f\u0440\u0430\u0432\u0438\u043b\u0430 \u0441\u0435\u0440\u0432\u0438\u0441\u0430"
            }), (0, L.jsx)(y.Icon, {
              name: "right",
              size: 20,
              color: p.DesignColors.textSecondary
            })]
          }), (0, L.jsxs)(f.default, {
            style: [w.row, w.divider],
            accessibilityLabel: "\u0427\u0442\u043e \u043c\u044b \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u043c",
            onPress: () => o.default.openURL(D.LEGAL_URL.privacy),
            children: [(0, L.jsx)(u.default, {
              style: w.label,
              children: "\u0427\u0442\u043e \u043c\u044b \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u043c"
            }), (0, L.jsx)(y.Icon, {
              name: "right",
              size: 20,
              color: p.DesignColors.textSecondary
            })]
          })]
        }), (0, L.jsxs)(t.default, {
          style: w.group,
          children: [(0, L.jsxs)(t.default, {
            style: w.row,
            children: [(0, L.jsxs)(t.default, {
              style: w.diagnosticsText,
              children: [(0, L.jsx)(u.default, {
                style: w.label,
                children: "\u041e\u0442\u0447\u0451\u0442\u044b \u043e\u0431 \u043e\u0448\u0438\u0431\u043a\u0430\u0445"
              }), (0, L.jsx)(u.default, {
                style: w.description,
                children: T.allowed ? '\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u2014 \u0442\u0430\u043a \u043c\u044b \u0432\u0438\u0434\u0438\u043c, \u0447\u0442\u043e \u0441\u043b\u043e\u043c\u0430\u043b\u043e\u0441\u044c' : '\u041d\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c. \u041f\u0430\u0434\u0435\u043d\u0438\u044f \u0432\u0438\u0434\u0438\u043c \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e \u0432\u0430\u0448\u0438\u043c \u0441\u043b\u043e\u0432\u0430\u043c'
              })]
            }), (0, L.jsx)(b.default, {
              value: T.allowed,
              onValueChange: T.set,
              disabled: T.loading || T.saving,
              label: "\u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u043e\u0442\u0447\u0451\u0442\u043e\u0432 \u043e\u0431 \u043e\u0448\u0438\u0431\u043a\u0430\u0445"
            })]
          }), T.error && (0, L.jsx)(u.default, {
            accessibilityLiveRegion: "polite",
            style: w.error,
            children: T.error
          }), T.needsSync && (0, L.jsx)(f.default, {
            style: [w.row, w.divider],
            accessibilityLabel: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u043e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u043e\u0442\u0447\u0451\u0442\u043e\u0432",
            disabled: T.saving,
            onPress: () => T.set(!1),
            children: (0, L.jsx)(u.default, {
              style: w.label,
              children: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u043e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u043e\u0442\u0447\u0451\u0442\u043e\u0432"
            })
          })]
        })]
      })]
    });
  }
  const w = l.default.create({
    content: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
      gap: 16
    },
    group: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: p.DesignColors.border,
      backgroundColor: p.DesignColors.surface,
      overflow: 'hidden'
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      minHeight: 64,
      padding: 16
    },
    divider: {
      borderTopWidth: 1,
      borderTopColor: p.DesignColors.border
    },
    label: Object.assign({}, p.DesignTypography.body, {
      flexShrink: 1,
      flexGrow: 1,
      color: p.DesignColors.text
    }),
    diagnosticsText: {
      flex: 1,
      minWidth: 0,
      gap: 8
    },
    description: Object.assign({}, p.DesignTypography.caption, {
      color: p.DesignColors.textSecondary
    }),
    error: Object.assign({}, p.DesignTypography.caption, {
      color: p.DesignColors.danger,
      padding: 16
    })
  });
};
