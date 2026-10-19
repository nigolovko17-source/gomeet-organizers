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
      return j;
    }
  });
  var t = e(r(d[0])),
    n = e(r(d[1])),
    s = e(r(d[2])),
    u = e(r(d[3])),
    l = e(r(d[4])),
    o = r(d[5]),
    c = r(d[6]),
    f = r(d[7]),
    _ = r(d[8]),
    b = r(d[9]);
  function j() {
    const {
        userId: e
      } = (0, f.useAuth)(),
      {
        events: n,
        loading: j
      } = (0, o.useDashboard)(e),
      E = c.PROFILE_DEMO_METRICS ? n.map(c.demoDashboardEvent) : n;
    return (0, b.jsxs)(s.default, {
      style: x.screen,
      children: [(0, b.jsx)(u.default, {}), j ? (0, b.jsx)(s.default, {
        style: x.center,
        children: (0, b.jsx)(t.default, {
          color: _.DesignColors.text
        })
      }) : (0, b.jsx)(l.default, {
        events: E,
        ticketsLabel: c.PROFILE_DEMO_METRICS ? '\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u043e \u0431\u0438\u043b\u0435\u0442\u043e\u0432' : '\u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u043e \u0431\u0438\u043b\u0435\u0442\u043e\u0432',
        amountLabel: "\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u0431\u0438\u043b\u0435\u0442\u043e\u0432"
      })]
    });
  }
  const x = n.default.create({
    screen: {
      flex: 1,
      backgroundColor: _.DesignColors.background
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
}