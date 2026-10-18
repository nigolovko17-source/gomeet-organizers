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
      return F;
    }
  });
  var t = r(d[0]),
    l = e(r(d[1])),
    o = e(r(d[2]));
  r(d[3]);
  var s = e(r(d[4])),
    n = e(r(d[5])),
    c = e(r(d[6])),
    u = e(r(d[7])),
    f = e(r(d[8])),
    h = r(d[9]),
    p = e(r(d[10])),
    x = e(r(d[11])),
    b = e(r(d[12])),
    y = r(d[13]),
    j = e(r(d[14])),
    S = e(r(d[15])),
    C = r(d[16]),
    w = e(r(d[17])),
    v = e(r(d[18])),
    P = e(r(d[19])),
    k = r(d[20]),
    D = r(d[21]),
    R = r(d[22]),
    T = r(d[23]),
    O = r(d[24]),
    z = r(d[25]),
    M = r(d[26]),
    I = r(d[27]),
    E = r(d[28]),
    W = r(d[29]),
    B = r(d[30]);
  const V = W.palettes.dark,
    A = e => e > 0 ? String(e) : void 0;
  function F() {
    const e = (0, E.useColumnContent)(),
      {
        width: l,
        height: k
      } = (0, f.default)(),
      [W, V] = (0, t.useState)(null),
      F = Math.min(340, l - 48, Math.max(240, .64 * l)),
      G = Math.min((W?.y ?? 24) + (W?.height ?? 48) + 8, Math.max(12, k - 180)),
      q = Math.max(12, Math.min(l - F - 12, l - ((W?.x ?? l - 64) + (W?.width ?? 48)))),
      Q = (0, h.useNavigation)(),
      {
        profile: N,
        loading: J,
        failed: K,
        reload: U
      } = (0, D.useProfile)();
    (0, h.useFocusEffect)((0, t.useCallback)(() => {
      U();
    }, [U]));
    const {
      counts: X,
      reload: Y
    } = (0, D.useFollowCounts)();
    (0, h.useFocusEffect)((0, t.useCallback)(() => {
      Y();
    }, [Y]));
    const {
        stats: Z
      } = (0, R.useAchievements)(),
      {
        signOut: $,
        deleteAccount: ee,
        userId: te
      } = (0, z.useAuth)(),
      le = (0, M.usePayoutAccess)(te),
      ae = (0, O.useAmIModerator)(te),
      {
        mode: oe,
        canOrganize: ie,
        setMode: se,
        ready: SettingsModeReady
      } = (0, I.useMode)(),
      {
        application: ne
      } = (0, T.useOrganizerApplication)(te),
      [re, de] = (0, t.useState)(!1),
      [ce, ge] = (0, t.useState)(''),
      ue = te ? 'org' === oe ? (0, y.organizerProfileLink)(te) : (0, y.userProfileLink)(te) : '',
      fe = async () => {
        ge('');
        try {
          await navigator.clipboard.writeText(ue);
        } catch {
          ge('\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.');
        }
      },
      [he, pe] = (0, t.useState)(!1);
    (0, h.useFocusEffect)((0, t.useCallback)(() => () => pe(!1), []));
    const [xe, be] = (0, t.useState)(!1),
      [ye, je] = (0, t.useState)(!1),
      [me, Se] = (0, t.useState)(!1),
      [Ce, we] = (0, t.useState)(null);
    const settingsReturn = useSettingsReturn(Q, JSON.stringify([te, oe]), pe, de);
    return te ? (0, B.jsxs)(p.default, {
      background: "bg",
      children: [(0, B.jsxs)(n.default, {
        contentContainerStyle: [_.body, e],
        showsVerticalScrollIndicator: !1,
        children: [K && !N.name ? (0, B.jsxs)(u.default, {
          style: {
            gap: 16,
            paddingVertical: 32
          },
          children: [(0, B.jsx)(j.default, {
            variant: "sectionTitle",
            children: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c"
          }), (0, B.jsx)(j.default, {
            children: "\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."
          }), (0, B.jsx)(S.default, {
            label: "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0443 \u043f\u0440\u043e\u0444\u0438\u043b\u044f",
            onPress: U
          })]
        }) : (0, B.jsx)(w.default, {
          profile: N,
          loading: J,
          counts: X,
          onSettings: event => {
            V(event);
            settingsReturn.open();
          }
        }), (0, B.jsx)(v.default, {})]
      }), (0, B.jsx)(o.default, {
        visible: he,
        transparent: !0,
        animationType: "fade",
        onRequestClose: settingsReturn.close,
        children: B.jsxs(B.Fragment, {
          children: [B.jsx(SettingsPanel, {
            profile: N,
            loading: J,
            failed: K,
            userId: te,
            mode: oe,
            canOrganize: ie,
            modeReady: SettingsModeReady,
            stats: Z,
            application: ne,
            moderator: ae,
            payout: le,
            onClose: settingsReturn.close,
            onMode: () => {
              if (!SettingsModeReady) return;
              if (ie) {
                settingsReturn.cancel();
                se(oe === 'org' ? 'guest' : 'org');
                pe(false);
              } else settingsReturn.navigate('Verification');
            },
            onNavigate: settingsReturn.navigate,
            onCopy: fe,
            copyError: ce,
            onQR: settingsReturn.openQR,
            onRetry: U
          }), (0, B.jsx)(L, {
            visible: xe,
            title: "\u0412\u044b\u0439\u0442\u0438 \u0438\u0437 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430?",
            text: "\u0412\u0445\u043e\u0434 \u0430\u043d\u043e\u043d\u0438\u043c\u043d\u044b\u0439 \u2014 \u0432\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u0432 \u044d\u0442\u043e\u0442 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u043d\u0435 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u0441\u044f. \u0421 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430 \u0438\u0441\u0447\u0435\u0437\u043d\u0443\u0442 \u043e\u0442\u043c\u0435\u0442\u043a\u0438 \xab\u0438\u0434\u0443\xbb, \u0431\u0435\u0439\u0434\u0436\u0438 \u0438 \u043b\u0438\u0447\u043d\u044b\u0435 \u043f\u0435\u0440\u0435\u043f\u0438\u0441\u043a\u0438.",
            action: "\u0432\u044b\u0439\u0442\u0438",
            onCancel: () => be(!1),
            onConfirm: () => {
              be(!1), $();
            }
          }), (0, B.jsx)(L, {
            visible: ye,
            title: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442?",
            text: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043d\u0435\u043e\u0431\u0440\u0430\u0442\u0438\u043c\u043e. \u041d\u0430\u0432\u0441\u0435\u0433\u0434\u0430 \u0443\u0434\u0430\u043b\u044f\u0442\u0441\u044f \u043f\u0440\u043e\u0444\u0438\u043b\u044c, \u043e\u0442\u043c\u0435\u0442\u043a\u0438 \xab\u0438\u0434\u0443\xbb \u0438 \xab\u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435\xbb, \u0431\u0438\u043b\u0435\u0442\u044b, \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0438 \u0438 \u0434\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u044f. \u0421\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0435 \u0432\u0430\u043c\u0438 \u0441\u043e\u0431\u044b\u0442\u0438\u044f \u043e\u0441\u0442\u0430\u043d\u0443\u0442\u0441\u044f, \u043d\u043e \u0431\u0435\u0437 \u043f\u0440\u0438\u0432\u044f\u0437\u043a\u0438 \u043a \u0432\u0430\u043c.",
            action: "\u0443\u0434\u0430\u043b\u0438\u0442\u044c",
            busy: me,
            error: Ce,
            onCancel: () => !me && je(!1),
            onConfirm: async () => {
              Se(!0), we(null);
              const e = await ee();
              Se(!1), e ? je(!1) : we('\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.');
            }
          })]
        })
      }), (0, B.jsx)(o.default, {
        visible: re,
        transparent: !0,
        animationType: "none",
        onRequestClose: settingsReturn.closeQR,
        children: re && (0, B.jsx)(x.default, {
          design: "2026",
          title: "QR-\u043a\u043e\u0434 \u043f\u0440\u043e\u0444\u0438\u043b\u044f",
          onClose: settingsReturn.closeQR,
          children: B.jsx(ProfileQrCard, {
            profile: N,
            profileLink: ue,
            loading: J,
            failed: K,
            onRetry: U,
            identity: te + ":" + oe
          }, te + ":" + oe)
        })
      })]
    }) : (0, B.jsx)(p.default, {
      background: "bg",
      children: (0, B.jsx)(P.default, {
        glyph: "me",
        title: "\u0417\u0434\u0435\u0441\u044c \u0431\u0443\u0434\u0435\u0442 \u0432\u0430\u0448 \u043f\u0440\u043e\u0444\u0438\u043b\u044c",
        text: "\u0411\u0438\u043b\u0435\u0442\u044b, \xab\u0438\u0434\u0443\xbb, \u0434\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u044f \u0438 \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f, \u043a\u0430\u043a \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u0437\u043d\u0430\u043a\u043e\u043c\u0438\u043c\u0441\u044f. \u042d\u0442\u043e \u043e\u0434\u043d\u043e \u043f\u043e\u043b\u0435.",
        reason: "profile"
      })
    });
  }
  function H({
    glyph: e,
    label: l,
    value: o,
    danger: n,
    soon: c,
    busy: u,
    first: f,
    onPress: h
  }) {
    const [p, x] = (0, t.useState)(!1);
    return (0, B.jsxs)(s.default, {
      onFocus: () => x(!0),
      onBlur: () => x(!1),
      style: ({
        pressed: e
      }) => [_.row, p && _.rowFocus, !f && _.rowRule, c && _.rowOff, e && W.PRESSED],
      onPress: h,
      disabled: c || u,
      accessibilityState: {
        disabled: !(!c && !u),
        busy: !!u
      },
      accessibilityRole: "button",
      accessibilityLabel: l,
      children: [(0, B.jsx)(j.default, {
        style: [_.rowLabel, n && _.rowDanger],
        children: l
      }), !!o && (0, B.jsx)(j.default, {
        style: _.rowValue,
        children: o
      }), (0, B.jsx)(k.Icon, {
        name: e,
        size: W.IconSize.md,
        color: n ? V.danger : C.DesignColors.textSecondary
      })]
    });
  }
  function L({
    visible: e,
    title: t,
    text: c,
    action: f,
    busy: h,
    error: p,
    onCancel: x,
    onConfirm: b
  }) {
    return (0, B.jsx)(o.default, {
      visible: e,
      transparent: !0,
      animationType: "fade",
      onRequestClose: x,
      children: (0, B.jsx)(u.default, {
        style: _.backdrop,
        children: (0, B.jsxs)(n.default, {
          style: _.dialog,
          contentContainerStyle: _.dialogContent,
          children: [(0, B.jsx)(j.default, {
            style: _.dialogTitle,
            children: t
          }), (0, B.jsx)(j.default, {
            style: _.dialogText,
            children: c
          }), !!p && (0, B.jsx)(j.default, {
            style: _.dialogError,
            children: p
          }), (0, B.jsxs)(u.default, {
            style: _.dialogRow,
            children: [(0, B.jsx)(s.default, {
              style: ({
                pressed: e
              }) => [_.dialogGhost, e && W.PRESSED],
              onPress: x,
              disabled: h,
              accessibilityRole: "button",
              accessibilityLabel: "\u043e\u0442\u043c\u0435\u043d\u0430",
              children: (0, B.jsx)(j.default, {
                style: _.dialogGhostText,
                children: "\u043e\u0442\u043c\u0435\u043d\u0430"
              })
            }), (0, B.jsx)(s.default, {
              style: ({
                pressed: e
              }) => [_.dialogDanger, h && _.rowOff, e && W.PRESSED],
              onPress: b,
              disabled: h,
              accessibilityRole: "button",
              accessibilityLabel: f,
              children: h ? (0, B.jsx)(l.default, {
                color: V.onAccent
              }) : (0, B.jsx)(j.default, {
                style: _.dialogDangerText,
                children: f
              })
            })]
          })]
        })
      })
    });
  }
  const _ = c.default.create({
    settingsOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.38)'
    },
    settingsPanel: {
      position: 'absolute',
      backgroundColor: C.DesignColors.surfaceRaised,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: C.DesignColors.border,
      overflow: 'hidden',
      boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
    },
    settingsContent: {
      paddingBottom: 4
    },
    body: {
      paddingHorizontal: W.Spacing.xl,
      paddingVertical: W.Spacing.xl,
      gap: W.Spacing.xl,
      paddingBottom: W.Spacing.xxxl
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: W.Spacing.lg
    },
    headBody: {
      flex: 1,
      gap: W.Spacing.sm
    },
    name: {
      fontFamily: W.Fonts.display,
      fontSize: 26,
      lineHeight: 29,
      letterSpacing: -.6,
      color: V.gray1,
      flexShrink: 1
    },
    meta: {
      fontSize: 13,
      color: V.gray4
    },
    pinned: {
      alignSelf: 'flex-start'
    },
    nameSkeleton: {
      width: 180,
      height: 26,
      borderRadius: W.Radius.full
    },
    metaSkeleton: {
      width: 120,
      height: 13,
      borderRadius: W.Radius.full,
      marginTop: 8
    },
    group: {
      backgroundColor: C.DesignColors.surfaceRaised,
      borderBottomWidth: 8,
      borderBottomColor: '#1D1D1D',
      overflow: 'hidden'
    },
    rowFocus: {
      outlineWidth: 2,
      outlineColor: C.DesignColors.focus,
      outlineOffset: -3
    },
    row: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      gap: W.Spacing.md,
      paddingHorizontal: 16,
      paddingVertical: 14
    },
    rowRule: {
      borderTopWidth: 1,
      borderTopColor: W.Border.subtleDark
    },
    rowOff: {
      opacity: .45
    },
    rowLabel: Object.assign({}, C.DesignTypography.body, {
      flex: 1,
      minWidth: 0,
      color: V.gray1
    }),
    rowTextWrap: {
      flex: 1,
      gap: 2
    },
    rowSub: Object.assign({}, C.DesignTypography.caption, {
      color: V.gray5
    }),
    rowDanger: {
      color: V.danger
    },
    rowValue: Object.assign({}, C.DesignTypography.caption, {
      flexShrink: 1,
      maxWidth: 100,
      color: V.gray4
    }),
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(10,10,10,0.72)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: W.Spacing.xxxl
    },
    dialog: {
      flexGrow: 0,
      width: '100%',
      maxWidth: 420,
      maxHeight: '90%',
      borderRadius: 24,
      backgroundColor: V.gray6,
      borderWidth: 1,
      borderColor: W.Border.subtleDark
    },
    dialogContent: {
      padding: 24
    },
    dialogTitle: Object.assign({}, C.DesignTypography.sectionTitle, {
      color: V.gray1
    }),
    dialogText: Object.assign({}, C.DesignTypography.body, {
      color: V.gray4,
      marginTop: W.Spacing.sm
    }),
    dialogError: {
      fontSize: 13,
      color: V.danger,
      marginTop: 10
    },
    dialogRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: W.Spacing.xl
    },
    dialogGhost: {
      flex: 1,
      minHeight: 48,
      paddingVertical: 12,
      borderRadius: W.Radius.pill,
      borderWidth: 1,
      borderColor: W.Border.subtleDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    dialogGhostText: {
      fontSize: 15,
      fontWeight: '600',
      color: V.gray1
    },
    dialogDanger: {
      flex: 1,
      minHeight: 48,
      paddingVertical: 12,
      borderRadius: W.Radius.pill,
      backgroundColor: V.danger,
      alignItems: 'center',
      justifyContent: 'center'
    },
    dialogDangerText: {
      fontSize: 15,
      fontWeight: '600',
      color: V.onAccent
    }
  });
  const React = t,
    Activity = l.default,
    Pressable = s.default,
    ScrollView = n.default,
    View = u.default,
    Text = j.default,
    AccountInfo = v.default;
  const colors = C.DesignColors,
    Icon = r(d[31]).Feather,
    useSafeAreaInsets = r(d[32]).useSafeAreaInsets,
    useColumnContent = E.useColumnContent;
  function SettingsPanel({
    profile,
    loading,
    failed,
    userId,
    mode,
    canOrganize,
    modeReady,
    stats,
    application,
    moderator,
    payout,
    onClose,
    onMode,
    onNavigate,
    onCopy,
    copyError,
    onQR,
    onRetry
  }) {
    const column = useColumnContent(),
      insets = useSafeAreaInsets(),
      busy = loading,
      error = failed;
    const organizerConnected = canOrganize;
    const modeLabel = organizerConnected ? mode === 'org' ? 'Режим гостя' : 'Режим организатора' : 'Стать организатором';
    const unavailable = busy || error || !userId;
    return React.createElement(View, {
      accessibilityViewIsModal: true,
      style: [styles.screen, {
        paddingTop: insets.top
      }]
    }, React.createElement(View, {
      style: [column, styles.header]
    }, React.createElement(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: "\u041D\u0430\u0437\u0430\u0434 \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u044C",
      onPress: onClose,
      style: styles.back
    }, React.createElement(Icon, {
      name: "arrow-left",
      size: 21,
      color: colors.text
    })), React.createElement(Text, {
      variant: "label",
      style: styles.muted
    }, "\u041F\u0440\u043E\u0444\u0438\u043B\u044C")), React.createElement(ScrollView, {
      style: {
        flex: 1
      },
      showsVerticalScrollIndicator: false,
      contentContainerStyle: [column, styles.body]
    }, React.createElement(Text, {
      variant: "sectionTitle",
      accessibilityRole: "header",
      style: styles.title
    }, "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"), React.createElement(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: modeLabel,
      onPress: onMode,
      disabled: !modeReady,
      accessibilityState: {
        disabled: !modeReady
      },
      style: ({
        pressed
      }) => [styles.mode, pressed && styles.pressed]
    }, React.createElement(View, {
      style: styles.modeIcon
    }, React.createElement(Icon, {
      name: organizerConnected ? 'repeat' : 'plus',
      size: 21,
      color: colors.text
    })), React.createElement(View, {
      style: {
        flex: 1,
        gap: 4
      }
    }, React.createElement(Text, {
      variant: "label",
      style: styles.modeTitle
    }, modeLabel), React.createElement(Text, {
      variant: "caption",
      style: styles.muted
    }, organizerConnected ? mode === 'org' ? 'Сейчас вы организатор' : 'Сейчас вы гость' : 'Подключение профиля организатора')), React.createElement(Icon, {
      name: organizerConnected ? 'arrow-up-right' : 'arrow-right',
      size: 20,
      color: colors.textSecondary
    })), React.createElement(View, {
      style: styles.section
    }, React.createElement(Text, {
      variant: "label",
      style: styles.sectionLabel
    }, "\u041F\u0440\u043E\u0444\u0438\u043B\u044C"), busy && React.createElement(View, {
      style: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 8
      }
    }, React.createElement(Activity, {
      color: colors.textSecondary,
      accessibilityLabel: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u0440\u043E\u0444\u0438\u043B\u044F"
    }), React.createElement(Text, {
      variant: "caption",
      style: styles.muted
    }, "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u043F\u0440\u043E\u0444\u0438\u043B\u044C\u2026")), (error || !userId) && React.createElement(View, {
      style: styles.error
    }, React.createElement(Text, {
      variant: "label"
    }, !userId ? 'Нужен вход' : 'Профиль не загрузился'), React.createElement(Text, {
      variant: "caption",
      style: styles.muted
    }, !userId ? 'Войдите, чтобы открыть настройки профиля.' : 'Попробуйте ещё раз, чтобы открыть данные профиля.'), userId && React.createElement(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443 \u043F\u0440\u043E\u0444\u0438\u043B\u044F",
      onPress: onRetry,
      style: styles.retry
    }, React.createElement(Text, {
      variant: "label",
      style: {
        fontSize: 12
      }
    }, "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C"), React.createElement(Icon, {
      name: "rotate-cw",
      size: 15,
      color: colors.text
    }))), !!copyError && React.createElement(Text, {
      variant: "caption",
      accessibilityRole: "alert",
      style: {
        color: colors.danger,
        padding: 4
      }
    }, copyError), React.createElement(View, {
      style: styles.group
    }, React.createElement(SettingsRow, {
      first: true,
      icon: "user",
      label: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C",
      disabled: unavailable,
      onPress: () => onNavigate('EditProfile')
    }), React.createElement(SettingsRow, {
      icon: "link",
      label: "\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043F\u0440\u043E\u0444\u0438\u043B\u044C",
      end: "copy",
      disabled: unavailable,
      onPress: onCopy
    }), React.createElement(SettingsRow, {
      icon: "grid",
      label: "QR-\u043A\u043E\u0434",
      disabled: unavailable,
      onPress: onQR
    }))), React.createElement(AccountInfo, null), React.createElement(View, {
      style: styles.section
    }, React.createElement(Text, {
      variant: "label",
      style: styles.sectionLabel
    }, "\u0421\u0435\u0440\u0432\u0438\u0441"), React.createElement(View, {
      style: styles.group
    }, canOrganize && ['pending', 'rejected'].includes(application?.status) && React.createElement(SettingsRow, {
      first: true,
      icon: "check-circle",
      label: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0418\u041D\u041D",
      value: application.status === 'pending' ? 'На проверке' : 'Отклонено',
      onPress: () => onNavigate('Verification')
    }), React.createElement(SettingsRow, {
      first: !(canOrganize && ['pending', 'rejected'].includes(application?.status)),
      icon: "tag",
      label: "\u041C\u043E\u0438 \u0431\u0438\u043B\u0435\u0442\u044B",
      value: !busy && stats?.purchases > 0 ? String(stats.purchases) : null,
      onPress: () => onNavigate('Tickets')
    }), React.createElement(SettingsRow, {
      icon: "slash",
      label: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435",
      onPress: () => onNavigate('Blocked')
    }), moderator && React.createElement(SettingsRow, {
      icon: "flag",
      label: "\u0420\u0430\u0437\u0431\u043E\u0440 \u0436\u0430\u043B\u043E\u0431",
      onPress: () => onNavigate('Moderation')
    }), moderator && React.createElement(SettingsRow, {
      icon: "inbox",
      label: "\u041E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F",
      onPress: () => onNavigate('SupportQueue')
    }), React.createElement(SettingsRow, {
      icon: "message-circle",
      label: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430",
      onPress: () => onNavigate('Support')
    }), payout.data?.can_view && React.createElement(SettingsRow, {
      icon: "credit-card",
      label: "\u0412\u044B\u043F\u043B\u0430\u0442\u044B \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430\u043C",
      onPress: () => onNavigate('Payouts')
    }), React.createElement(SettingsRow, {
      icon: "info",
      label: "\u041E \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438",
      onPress: () => onNavigate('About')
    })))));
  }
  function SettingsRow({
    icon,
    label,
    end = 'chevron-right',
    value,
    first,
    onPress,
    disabled
  }) {
    const [focused, setFocused] = React.useState(false);
    return React.createElement(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: label,
      accessibilityState: {
        disabled: !!disabled
      },
      disabled: !!disabled,
      onPress: onPress,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      style: ({
        pressed
      }) => [styles.row, !first && styles.rule, focused && styles.focus, disabled && styles.disabled, pressed && styles.pressed]
    }, React.createElement(View, {
      style: styles.rowIcon
    }, React.createElement(Icon, {
      name: icon,
      size: 20,
      color: colors.textSecondary
    })), React.createElement(Text, {
      variant: "label",
      style: styles.rowLabel
    }, label), value && React.createElement(View, {
      style: styles.value
    }, React.createElement(Text, {
      variant: "caption",
      style: styles.valueText
    }, value)), React.createElement(Icon, {
      name: end,
      size: 17,
      color: colors.textSecondary
    }));
  }
  const styles = {
    screen: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    back: {
      width: 44,
      height: 44,
      borderWidth: 1,
      borderColor: '#393936',
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center'
    },
    muted: {
      color: colors.textSecondary
    },
    body: {
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
      gap: 26
    },
    title: {
      fontSize: 26,
      lineHeight: 33
    },
    mode: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      minHeight: 80,
      borderWidth: 1,
      borderColor: '#41413b',
      borderRadius: 20,
      backgroundColor: '#141413'
    },
    modeIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#242422'
    },
    modeTitle: {
      fontSize: 14,
      lineHeight: 20
    },
    section: {
      gap: 10
    },
    sectionLabel: {
      color: colors.textSecondary,
      paddingLeft: 4,
      fontSize: 12,
      lineHeight: 18
    },
    group: {
      borderWidth: 1,
      borderColor: '#333330',
      borderRadius: 20,
      backgroundColor: '#191918',
      overflow: 'hidden'
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 58,
      paddingHorizontal: 16,
      paddingVertical: 15
    },
    rowIcon: {
      width: 23,
      alignItems: 'center'
    },
    rowLabel: {
      flex: 1,
      minWidth: 0,
      fontSize: 14,
      lineHeight: 20
    },
    rule: {
      borderTopWidth: 1,
      borderTopColor: '#30302d'
    },
    value: {
      paddingHorizontal: 8,
      minHeight: 24,
      borderRadius: 12,
      backgroundColor: '#292927',
      alignItems: 'center',
      justifyContent: 'center'
    },
    valueText: {
      fontSize: 11,
      lineHeight: 16,
      color: colors.textSecondary
    },
    pressed: {
      opacity: .65
    },
    disabled: {
      opacity: .4
    },
    focus: {
      outlineStyle: 'solid',
      outlineWidth: 2,
      outlineColor: colors.text,
      outlineOffset: -3
    },
    error: {
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: '#51413c',
      borderRadius: 16
    },
    retry: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 10,
      minHeight: 44,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: '#605c53',
      borderRadius: 22
    }
  };
  const QRAvatar = (v => v && v.__esModule ? v.default : v)(r(d[33]));
  function ProfileQrCard({
    profile,
    profileLink,
    loading,
    failed,
    onRetry,
    identity
  }) {
    const {
      width,
      height
    } = f.default();
    const [copying, setCopying] = React.useState(false),
      [copied, setCopied] = React.useState(false),
      [copyError, setCopyError] = React.useState(false),
      [focused, setFocused] = React.useState(false);
    const mounted = React.useRef(true),
      working = React.useRef(null),
      context = React.useRef(null),
      epoch = React.useRef(0);
    const busy = loading,
      error = failed,
      unavailable = busy || error || !profileLink;
    context.current = {
      identity,
      profileLink,
      unavailable
    };
    React.useEffect(() => {
      mounted.current = true;
      const focusTimer = window.setTimeout(() => {
        document.querySelector('[role="button"][aria-label="закрыть"]')?.focus();
      }, 0);
      return () => {
        mounted.current = false;
        epoch.current++;
        working.current = null;
        window.clearTimeout(focusTimer);
      };
    }, []);
    React.useEffect(() => {
      epoch.current++;
      working.current = null;
      setCopying(false);
      setCopied(false);
      setCopyError(false);
    }, [identity, profileLink, unavailable]);
    const size = Math.max(168, Math.floor(Math.min(224, width - 112, height - 390)));
    const copy = async () => {
      const current = context.current;
      if (current.unavailable || working.current) return;
      const token = {
        identity: current.identity,
        profileLink: current.profileLink,
        epoch: epoch.current
      };
      working.current = token;
      setCopying(true);
      setCopied(false);
      setCopyError(false);
      const accepts = () => mounted.current && working.current === token && epoch.current === token.epoch && context.current.identity === token.identity && context.current.profileLink === token.profileLink && !context.current.unavailable;
      try {
        if (typeof navigator.clipboard?.writeText !== 'function') throw Error('Clipboard unavailable');
        await navigator.clipboard.writeText(token.profileLink);
        if (accepts()) setCopied(true);
      } catch {
        if (accepts()) setCopyError(true);
      } finally {
        if (mounted.current && working.current === token) {
          working.current = null;
          setCopying(false);
        }
      }
    };
    return React.createElement(View, {
      style: QRStyle.content
    }, busy ? React.createElement(View, {
      style: QRStyle.state
    }, React.createElement(Activity, {
      color: colors.textSecondary,
      accessibilityLabel: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 QR-\u043A\u043E\u0434\u0430"
    }), React.createElement(Text, {
      variant: "caption",
      style: QRStyle.caption
    }, "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u043F\u0440\u043E\u0444\u0438\u043B\u044C\u2026")) : error || !profileLink ? React.createElement(View, {
      style: QRStyle.state
    }, React.createElement(Icon, {
      name: "grid",
      size: 28,
      color: colors.textSecondary
    }), React.createElement(Text, {
      variant: "label",
      accessibilityRole: "alert",
      style: QRStyle.stateTitle
    }, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C QR-\u043A\u043E\u0434"), React.createElement(Text, {
      variant: "caption",
      style: QRStyle.caption
    }, "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."), React.createElement(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443 QR-\u043A\u043E\u0434\u0430",
      onPress: onRetry,
      style: ({
        pressed
      }) => [QRStyle.retry, pressed && QRStyle.pressed]
    }, React.createElement(Text, {
      variant: "label",
      style: QRStyle.retryLabel
    }, "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C"), React.createElement(Icon, {
      name: "rotate-cw",
      size: 16,
      color: colors.text
    }))) : React.createElement(React.Fragment, null, React.createElement(View, {
      style: [QRStyle.identity, {
        maxWidth: size + 48
      }]
    }, React.createElement(QRAvatar, {
      size: 44,
      name: profile.name,
      avatarUrl: profile.avatarUrl
    }), React.createElement(View, {
      style: QRStyle.identityText
    }, React.createElement(Text, {
      variant: "label",
      style: QRStyle.name
    }, profile.name), !!profile.username && React.createElement(Text, {
      variant: "caption",
      style: QRStyle.username
    }, "@", profile.username.replace(/^@/, '')))), React.createElement(View, {
      accessibilityLabel: "QR-\u043A\u043E\u0434 \u043F\u0440\u043E\u0444\u0438\u043B\u044F",
      style: QRStyle.qrFrame
    }, React.createElement(b.default, {
      value: profileLink,
      size: size,
      color: "#000000",
      backgroundColor: "#ffffff"
    }))), React.createElement(View, {
      style: QRStyle.actions
    }, React.createElement(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: copied ? 'Ссылка скопирована' : 'Скопировать ссылку на профиль',
      disabled: unavailable || copying,
      "aria-busy": copying,
      accessibilityState: {
        disabled: unavailable || copying,
        busy: copying
      },
      onPress: copy,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      style: ({
        pressed
      }) => [QRStyle.copy, focused && QRStyle.focus, (unavailable || copying) && QRStyle.disabled, pressed && QRStyle.pressed]
    }, React.createElement(Text, {
      variant: "label",
      accessibilityLiveRegion: "polite",
      style: QRStyle.copyLabel
    }, copying ? 'Копируем…' : copied ? 'Ссылка скопирована' : 'Скопировать ссылку'), React.createElement(Icon, {
      name: copied ? 'check' : 'copy',
      size: 18,
      color: "#101010"
    })), copyError && React.createElement(Text, {
      variant: "caption",
      accessibilityRole: "alert",
      style: QRStyle.error
    }, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443.", '\n', "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.")));
  }
  const QRStyle = {
    content: {
      alignItems: 'center',
      gap: 22,
      paddingTop: 6,
      paddingBottom: 20
    },
    identity: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 44
    },
    identityText: {
      minWidth: 0,
      flexShrink: 1,
      gap: 4
    },
    name: {
      fontSize: 16,
      lineHeight: 22
    },
    username: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary
    },
    qrFrame: {
      padding: 24,
      backgroundColor: '#ffffff',
      borderRadius: 24
    },
    caption: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 280
    },
    actions: {
      alignSelf: 'stretch',
      gap: 12,
      paddingTop: 2
    },
    copy: {
      minHeight: 52,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 26,
      backgroundColor: V.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    },
    copyLabel: {
      fontSize: 13,
      lineHeight: 20,
      color: '#101010',
      flexShrink: 1
    },
    error: {
      fontSize: 12,
      lineHeight: 18,
      color: '#e4b9a8',
      textAlign: 'center'
    },
    state: {
      minHeight: 316,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      paddingHorizontal: 12
    },
    stateTitle: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center'
    },
    retry: {
      minHeight: 44,
      paddingHorizontal: 16,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#4a4a44',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    retryLabel: {
      fontSize: 12,
      lineHeight: 18
    },
    focus: {
      outlineStyle: 'solid',
      outlineWidth: 2,
      outlineColor: colors.text,
      outlineOffset: 3
    },
    disabled: {
      opacity: .4
    },
    pressed: {
      opacity: .65
    }
  };
  function useSettingsReturn(navigation, identity, setSettings, setQR) {
    const pending = React.useRef(null);
    React.useEffect(() => {
      pending.current = null;
      setSettings(false);
      setQR(false);
    }, [identity, setSettings, setQR]);
    React.useEffect(() => navigation.addListener('state', () => {
      const state = navigation.getState(),
        active = state.routes[state.index];
      if (state.type === 'tab' && active?.name !== 'Profile') {
        pending.current = null;
        setSettings(false);
        setQR(false);
      }
    }), [navigation, setSettings, setQR]);
    h.useFocusEffect(React.useCallback(() => {
      const origin = pending.current;
      if (origin?.kind === 'route' && origin.identity === identity) {
        pending.current = null;
        setSettings(true);
      }
      return () => {
        if (pending.current?.kind === 'qr') {
          pending.current = null;
          setQR(false);
        }
      };
    }, [identity, setSettings, setQR]));
    const open = React.useCallback(() => {
      pending.current = null;
      setSettings(true);
    }, [setSettings]);
    const close = React.useCallback(() => {
      pending.current = null;
      setSettings(false);
    }, [setSettings]);
    const navigate = React.useCallback(screen => {
      pending.current = {
        kind: 'route',
        identity
      };
      setSettings(false);
      navigation.navigate(screen);
    }, [navigation, identity, setSettings]);
    const openQR = React.useCallback(() => {
      pending.current = {
        kind: 'qr',
        identity
      };
      setSettings(false);
      setQR(true);
    }, [identity, setSettings, setQR]);
    const closeQR = React.useCallback(() => {
      setQR(false);
      const origin = pending.current;
      pending.current = null;
      if (origin?.kind === 'qr' && origin.identity === identity) setSettings(true);
    }, [identity, setSettings, setQR]);
    const cancel = React.useCallback(() => {
      pending.current = null;
    }, []);
    return {
      open,
      close,
      navigate,
      openQR,
      closeQR,
      cancel
    };
  }
};
