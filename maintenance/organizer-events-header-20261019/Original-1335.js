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
      return S;
    }
  });
  var t = r(d[0]),
    s = e(r(d[1])),
    o = e(r(d[2])),
    l = e(r(d[3])),
    n = e(r(d[4])),
    c = e(r(d[5])),
    u = r(d[6]),
    h = r(d[7]),
    y = e(r(d[8])),
    f = e(r(d[9])),
    b = r(d[10]),
    x = r(d[11]),
    p = r(d[12]),
    j = r(d[13]),
    D = r(d[14]),
    C = r(d[15]);
  function v(e) {
    switch (e.status) {
      case "draft":
        return {
          label: "Черновик",
          color: x.DesignColors.textSecondary
        };
      case "pending":
        return {
          label: "На проверке",
          color: x.DesignColors.warning
        };
      case "removed":
        return {
          label: "Снято",
          color: x.DesignColors.danger
        };
      case "cancelled":
        return {
          label: "Отменено",
          color: x.DesignColors.danger
        };
      default:
        return e.isPast ? {
          label: "Завершено",
          color: x.DesignColors.textSecondary
        } : {
          label: "Опубликовано",
          color: x.DesignColors.success
        };
    }
  }
  function T(e) {
    return e.isPast || "cancelled" === e.status;
  }
  function S({
    events: e,
    ticketsLabel: l,
    amountLabel: S
  }) {
    const w = (0, u.useNavigation)(),
      I = (0, p.useColumnContent)(),
      {
        width: z,
        fontScale: R
      } = (0, c.default)(),
      O = z < 400,
      A = R > 1.3,
      [P, L] = (0, t.useState)("current"),
      H = e.filter(e => !T(e)),
      M = e.filter(T),
      W = "current" === P ? H : M;
    return (0, C.jsxs)(o.default, {
      contentContainerStyle: [k.list, I],
      showsVerticalScrollIndicator: !1,
      children: [(0, C.jsxs)(n.default, {
        style: k.heading,
        children: [(0, C.jsx)(y.default, {
          accessibilityRole: "header",
          style: k.pageTitle,
          children: "События"
        }), (0, C.jsx)(y.default, {
          style: k.subtitle,
          children: "Ваши встречи. Всё под контролем."
        })]
      }), e.length > 0 && (0, C.jsx)(n.default, {
        style: k.tabs,
        accessibilityRole: "tablist",
        children: [{
          id: "current",
          label: "Сейчас",
          count: H.length
        }, {
          id: "archive",
          label: "Архив",
          count: M.length
        }].map(e => (0, C.jsxs)(f.default, {
          accessibilityRole: "tab",
          accessibilityState: {
            selected: P === e.id
          },
          "aria-selected": P === e.id,
          accessibilityLabel: `${e.label}, \u0441\u043e\u0431\u044b\u0442\u0438\u0439: ${e.count}`,
          onPress: () => L(e.id),
          style: [k.tab, P === e.id && k.tabActive],
          children: [(0, C.jsx)(y.default, {
            style: [k.tabText, P === e.id && k.tabTextActive],
            children: e.label
          }), (0, C.jsx)(n.default, {
            style: [k.count, P === e.id && k.countActive],
            children: (0, C.jsx)(y.default, {
              style: [k.countText, P === e.id && k.tabTextActive],
              children: e.count
            })
          })]
        }, e.id))
      }), 0 === W.length ? (0, C.jsxs)(n.default, {
        style: k.empty,
        children: [(0, C.jsx)(h.SvgXml, {
          xml: D.organizerTicketsSvg,
          width: 128,
          height: 128,
          accessible: !1
        }), (0, C.jsx)(y.default, {
          style: k.emptyTitle,
          children: "archive" === P ? "История ещё впереди" : "Место для новой встречи"
        }), (0, C.jsx)(y.default, {
          style: k.emptyText,
          children: "archive" === P ? "Здесь будут завершённые и отменённые события." : "Создайте событие — здесь появятся участники, билеты и отметки на входе."
        }), "current" === P && (0, C.jsxs)(f.default, {
          style: k.create,
          onPress: () => w.navigate("Create"),
          children: [(0, C.jsx)(b.Icon, {
            name: "plus",
            size: 18,
            color: x.DesignColors.onActionPrimary
          }), (0, C.jsx)(y.default, {
            style: k.createText,
            children: "Создать событие"
          })]
        })]
      }) : W.map(e => {
        const t = v(e),
          o = e.stats.salesLimit,
          c = !e.stats.unlimited && null != o && o > 0,
          u = c ? Math.min(100, Math.max(0, Math.round(e.stats.ticketsSold / o * 100))) : null;
        return (0, C.jsxs)(n.default, {
          style: k.card,
          children: [(0, C.jsxs)(f.default, {
            style: [k.eventTop, A && k.stacked],
            onPress: () => w.navigate("OrgEventDetail", {
              eventId: e.id
            }),
            accessibilityLabel: `${T(e) ? "Посмотреть итоги события" : "Управлять событием"} ${e.title}`,
            children: [(0, C.jsx)(n.default, {
              style: [k.cover, O && k.coverCompact],
              children: e.imageUri ? (0, C.jsx)(s.default, {
                source: {
                  uri: e.imageUri
                },
                style: k.coverImage,
                resizeMode: "cover"
              }) : (0, C.jsx)(b.Icon, {
                name: "image",
                size: 28,
                color: x.DesignColors.textMuted
              })
            }), (0, C.jsxs)(n.default, {
              style: k.eventInfo,
              children: [(0, C.jsxs)(n.default, {
                style: k.status,
                children: [(0, C.jsx)(n.default, {
                  style: [k.statusDot, {
                    backgroundColor: t.color
                  }]
                }), (0, C.jsx)(y.default, {
                  style: [k.statusText, {
                    color: t.color
                  }],
                  children: t.label
                })]
              }), (0, C.jsx)(y.default, {
                style: [k.eventTitle, O && k.eventTitleCompact],
                children: e.title
              }), (0, C.jsxs)(n.default, {
                style: k.dateRow,
                children: [(0, C.jsx)(b.Icon, {
                  name: "cal",
                  size: 14,
                  color: x.DesignColors.textSecondary
                }), (0, C.jsx)(y.default, {
                  style: k.date,
                  children: e.when || "Дата пока не задана"
                })]
              })]
            })]
          }), (0, C.jsxs)(n.default, {
            style: [k.metrics, A && k.stacked],
            children: [(0, C.jsxs)(n.default, {
              style: [k.metric, k.dividedMetric, A && k.noDivider],
              children: [(0, C.jsxs)(n.default, {
                style: k.metricLabel,
                children: [(0, C.jsx)(b.Icon, {
                  name: "ticket",
                  size: 15,
                  color: x.DesignColors.textSecondary
                }), (0, C.jsx)(y.default, {
                  style: k.label,
                  children: "Билеты"
                })]
              }), (0, C.jsx)(y.default, {
                style: k.value,
                children: e.stats.ticketsSold.toLocaleString("ru-RU")
              })]
            }), (0, C.jsxs)(n.default, {
              style: k.metric,
              children: [(0, C.jsxs)(n.default, {
                style: k.metricLabel,
                children: [(0, C.jsx)(b.Icon, {
                  name: "scan",
                  size: 15,
                  color: x.DesignColors.textSecondary
                }), (0, C.jsx)(y.default, {
                  style: k.label,
                  children: "Пришли"
                })]
              }), (0, C.jsx)(y.default, {
                style: [k.value, 0 === e.stats.checkedIn && k.zero],
                children: e.stats.checkedIn.toLocaleString("ru-RU")
              })]
            })]
          }), (0, C.jsxs)(n.default, {
            style: k.ticketProgress,
            children: [(0, C.jsxs)(n.default, {
              style: k.progressCaption,
              children: [(0, C.jsxs)(y.default, {
                style: k.caption,
                children: [l, c ? ` \xb7 ${e.stats.ticketsSold} \u0438\u0437 ${o}` : ""]
              }), null != u && (0, C.jsxs)(y.default, {
                style: k.percentage,
                children: [u, "%"]
              })]
            }), null != u && (0, C.jsx)(n.default, {
              style: k.track,
              accessibilityRole: "progressbar",
              accessibilityLabel: "Оформлено от лимита билетов",
              accessibilityValue: {
                min: 0,
                max: 100,
                now: u
              },
              children: (0, C.jsx)(n.default, {
                style: [k.fill, {
                  width: `${u}%`
                }, T(e) && k.archiveFill]
              })
            })]
          }), (0, C.jsxs)(n.default, {
            style: [k.footer, A && k.stacked],
            children: [(0, C.jsx)(n.default, {
              style: k.amountBlock,
              children: e.stats.ticketAmount > 0 && (0, C.jsxs)(C.Fragment, {
                children: [(0, C.jsx)(y.default, {
                  style: k.caption,
                  children: S
                }), (0, C.jsx)(y.default, {
                  style: k.amount,
                  children: (0, j.rub)(e.stats.ticketAmount)
                })]
              })
            }), !T(e) && (0, C.jsxs)(f.default, {
              style: k.edit,
              onPress: () => w.navigate("EditEvent", {
                eventId: e.id
              }),
              accessibilityLabel: `\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c ${e.title}`,
              children: [(0, C.jsx)(y.default, {
                style: k.editText,
                children: "Править"
              }), (0, C.jsx)(b.Icon, {
                name: "right",
                size: 16,
                color: x.DesignColors.text
              })]
            })]
          })]
        }, e.id);
      })]
    });
  }
  const k = l.default.create({
    list: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 32,
      gap: 16
    },
    heading: {
      gap: 6,
      paddingBottom: 4
    },
    pageTitle: Object.assign({}, x.DesignTypography.sectionTitle, {
      fontSize: 28,
      lineHeight: 36
    }),
    subtitle: Object.assign({}, x.DesignTypography.caption, {
      fontSize: 13,
      color: x.DesignColors.textSecondary
    }),
    tabs: {
      flexDirection: "row",
      padding: 4,
      gap: 4,
      backgroundColor: x.DesignColors.surface,
      borderRadius: 18,
      marginBottom: 4
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 14
    },
    tabActive: {
      backgroundColor: x.DesignColors.actionPrimary
    },
    tabText: Object.assign({}, x.DesignTypography.label, {
      color: x.DesignColors.textSecondary
    }),
    tabTextActive: {
      color: x.DesignColors.onActionPrimary
    },
    count: {
      minWidth: 24,
      paddingHorizontal: 6,
      borderRadius: 8,
      backgroundColor: x.DesignColors.surfaceRaised,
      alignItems: "center"
    },
    countActive: {
      backgroundColor: "#DCD6CB"
    },
    countText: Object.assign({}, x.DesignTypography.caption, {
      color: x.DesignColors.textSecondary
    }),
    card: {
      backgroundColor: x.DesignColors.surface,
      borderWidth: 1,
      borderColor: "#30302E",
      borderRadius: 24,
      padding: 16,
      gap: 16
    },
    eventTop: {
      flexDirection: "row",
      gap: 16,
      alignItems: "center"
    },
    cover: {
      width: 100,
      height: 116,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: x.DesignColors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center"
    },
    coverCompact: {
      width: 76,
      height: 104
    },
    coverImage: {
      width: "100%",
      height: "100%"
    },
    eventInfo: {
      flex: 1,
      minWidth: 0,
      gap: 9
    },
    status: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    },
    statusDot: {
      width: 5,
      height: 5,
      borderRadius: 3
    },
    statusText: Object.assign({}, x.DesignTypography.caption, {
      fontSize: 11
    }),
    eventTitle: Object.assign({}, x.DesignTypography.sectionTitle, {
      fontSize: 20,
      lineHeight: 25
    }),
    eventTitleCompact: {
      fontSize: 16,
      lineHeight: 21
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    },
    date: Object.assign({}, x.DesignTypography.caption, {
      color: x.DesignColors.textSecondary,
      flex: 1,
      fontSize: 11
    }),
    metrics: {
      flexDirection: "row",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#30302E"
    },
    metric: {
      flex: 1,
      alignItems: "center",
      gap: 6
    },
    metricLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5
    },
    label: Object.assign({}, x.DesignTypography.caption, {
      color: x.DesignColors.textSecondary
    }),
    dividedMetric: {
      borderRightWidth: 1,
      borderColor: "#353533"
    },
    value: Object.assign({}, x.DesignTypography.price, {
      fontSize: 26,
      lineHeight: 32
    }),
    zero: {
      color: x.DesignColors.textMuted
    },
    ticketProgress: {
      gap: 8
    },
    progressCaption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8
    },
    caption: Object.assign({}, x.DesignTypography.caption, {
      color: x.DesignColors.textSecondary,
      flexShrink: 1
    }),
    percentage: Object.assign({}, x.DesignTypography.caption, {
      color: x.DesignColors.text,
      fontVariant: ["tabular-nums"]
    }),
    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: "#39332E",
      overflow: "hidden"
    },
    fill: {
      height: "100%",
      backgroundColor: x.DesignColors.brandAccent,
      borderRadius: 2
    },
    archiveFill: {
      backgroundColor: x.DesignColors.textMuted
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    amountBlock: {
      flex: 1,
      gap: 2
    },
    amount: Object.assign({}, x.DesignTypography.price, {
      fontSize: 18,
      lineHeight: 24
    }),
    edit: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 16,
      backgroundColor: x.DesignColors.surfaceRaised,
      borderRadius: 14
    },
    editText: Object.assign({}, x.DesignTypography.label, {
      fontSize: 12
    }),
    stacked: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 16
    },
    noDivider: {
      borderLeftWidth: 0,
      borderRightWidth: 0
    },
    empty: {
      alignItems: "center",
      backgroundColor: x.DesignColors.surface,
      borderRadius: 24,
      padding: 24,
      paddingBottom: 32,
      gap: 16
    },
    emptyTitle: Object.assign({}, x.DesignTypography.sectionTitle, {
      fontSize: 20,
      lineHeight: 27,
      textAlign: "center"
    }),
    emptyText: Object.assign({}, x.DesignTypography.body, {
      fontSize: 14,
      lineHeight: 22,
      color: x.DesignColors.textSecondary,
      textAlign: "center",
      maxWidth: 320
    }),
    create: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingHorizontal: 20,
      backgroundColor: x.DesignColors.actionPrimary,
      borderRadius: 16
    },
    createText: Object.assign({}, x.DesignTypography.label, {
      color: x.DesignColors.onActionPrimary
    })
  });
}