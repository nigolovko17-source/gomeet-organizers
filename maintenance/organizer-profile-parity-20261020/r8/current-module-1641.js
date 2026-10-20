__d(function (g, r, i, a, m, e, d) {
  var React = r(d[0]),
    v = r(d[1]),
    Modal = v.default || v,
    Navigation = r(d[2]),
    Mode = r(d[3]),
    Auth = r(d[4]);
  var Model = function () {
    var module = {
      exports: {}
    };
    const titles = {
      connection: 'Подключение организатора',
      company: 'Сведения и статус',
      bank: 'Реквизиты для выплат',
      contracts: 'Документы',
      document: 'Просмотр документа',
      limits: 'Условия и ограничения',
      contact: 'Почта аккаунта',
      consents: 'Приватность и согласия',
      visibility: 'Видимость профиля',
      followers: 'Подписчики',
      person: 'Профиль',
      history: 'История подключения',
      logout: 'Выход',
      signedout: 'Вход в аккаунт'
    };
    const states = {
      preparing: ['Подготовка подключения', 'Заполните сведения и проверьте готовность заявки.'],
      submitted: ['Заявка отправлена', 'Заявка передана на рассмотрение. Повторная отправка не требуется.'],
      reviewing: ['На рассмотрении', 'Дождитесь результата проверки.'],
      needs_information: ['Нужны уточнения', 'Уточните сведения в заявке и отправьте обновлённую версию.'],
      reviewed: ['Проверка завершена', 'Проверьте документы и доступные действия в кабинете.'],
      rejected: ['Заявка не одобрена', 'Причина решения доступна в истории подключения.'],
      unknown: ['Статус не подтверждён', 'Не удалось получить актуальный статус. Попробуйте ещё раз.']
    };
    function initial() {
      return {
        scenario: 'normal',
        profileStage: 'connected',
        application: 'reviewed',
        company: {
          category: 'Самозанятый',
          name: 'Демо-организатор',
          inn: '',
          city: 'Москва'
        },
        bank: {
          recipient: '',
          bik: '',
          account: ''
        },
        bankState: 'empty',
        diagnostics: false,
        documents: 'unavailable',
        followers: [],
        result: '',
        error: null,
        loading: false,
        allowed: {
          create_event: null,
          publish_event: null,
          sell_paid: null,
          receive_payout: null
        }
      };
    }
    function scenario(name) {
      let s = initial();
      s.scenario = name;
      if (name === 'guest-pending') s.profileStage = 'guest-pending';
      if (name.startsWith('profile-')) s.profileStage = name.slice(8);
      if (name in states) s.application = name;
      if (name === 'error') s.error = 'read';
      if (name === 'loading') s.loading = true;
      if (name === 'denied') s.error = 'access';
      if (name === 'followers') {
        s.followers = [{
          id: 'local-person-1',
          name: 'Александра',
          username: 'alexandra',
          city: 'Москва'
        }, {
          id: 'local-person-2',
          name: 'Михаил',
          username: 'mikhail',
          city: 'Москва'
        }];
      }
      if (name === 'documents') s.documents = 'sample';
      if (name === 'document-error') s.documents = 'error';
      if (name === 'bank-review') {
        s.bankState = 'pending';
        s.bank = {
          recipient: 'Демо-организатор',
          bik: '044525000',
          account: '40817810000000000000'
        };
      }
      if (name === 'bank-rejected' || name === 'quick-bank') s.bankState = 'rejected';
      if (name === 'quick-documents') s.documents = 'error';
      if (name === 'contact-error') s.error = 'contact';
      return s;
    }
    function validateCompany(f) {
      const e = {};
      if (f.name.trim().length < 2) e.name = 'Укажите имя или наименование.';
      if (f.inn && !/^\d{10}(\d{2})?$/.test(f.inn)) e.inn = 'Проверьте ИНН: 10 или 12 цифр.';
      return e;
    }
    function validateBank(f) {
      const e = {};
      if (f.recipient.trim().length < 2) e.recipient = 'Укажите получателя.';
      if (!/^\d{9}$/.test(f.bik)) e.bik = 'БИК — 9 цифр.';
      if (!/^\d{20}$/.test(f.account)) e.account = 'Расчётный счёт — 20 цифр.';
      return e;
    }
    function canEditCompany(s) {
      return ['preparing', 'needs_information', 'rejected'].includes(s.application);
    }
    function documentReadable(s) {
      return s.documents === 'sample';
    }
    const profileStages = {
      approved: {
        status: "Заявка одобрена",
        title: "Завершите подключение",
        description: "Вы можете пользоваться профилем организатора. Для дальнейшей работы подтвердите оставшиеся сведения.",
        action: "Продолжить подключение",
        step: 0
      },
      bank: {
        status: "Подключение не завершено",
        title: "Добавьте реквизиты",
        description: "Подтверждения добавлены. Следующий шаг — реквизиты организатора.",
        action: "Продолжить подключение",
        step: 0
      },
      review: {
        status: "Данные на проверке",
        title: "Проверяем сведения",
        description: "Дополнительные данные отправлены. Результат проверки появится здесь.",
        action: "Посмотреть статус",
        step: 1
      },
      correction: {
        status: "Нужны уточнения",
        title: "Уточните сведения",
        description: "По дополнительным данным есть замечания. Проверьте их и продолжите подключение.",
        action: "Посмотреть замечания",
        step: 1
      },
      documents: {
        status: "Остались документы",
        title: "Завершите оформление",
        description: "Дополнительные сведения проверены. Осталось ознакомиться с документами и подтвердить их принятие.",
        action: "Перейти к документам",
        step: 2
      },
      waiting: {
        status: "Подключение завершается",
        title: "Проверяем готовность кабинета",
        description: "Документы подтверждены. Доступ к дальнейшим действиям появится после обновления статуса.",
        action: "Обновить статус",
        step: 3
      },
      loading: {
        status: "Загружаем статус",
        title: "Подключение",
        description: "Получаем актуальный этап подключения.",
        action: null,
        step: null
      },
      error: {
        status: "Не удалось обновить статус",
        title: "Подключение",
        description: "Проверьте соединение и попробуйте ещё раз. Ваши сведения сохранены.",
        action: "Повторить",
        step: null
      }
    };
    module.exports = {
      profileStages,
      titles,
      states,
      initial,
      scenario,
      validateCompany,
      validateBank,
      canEditCompany,
      documentReadable
    };
    profileStages.bank = {
      status: 'Остались реквизиты',
      title: 'Подтвердите реквизиты',
      description: 'Подтверждения, проверка дополнительных данных и документы пройдены. Последний этап — подтверждение реквизитов.',
      action: 'Перейти к реквизитам',
      step: 3
    };
    profileStages.waiting = {
      status: 'Подключение завершается',
      title: 'Проверяем готовность кабинета',
      description: 'Подтверждения, проверка, документы и реквизиты пройдены. Ожидаем обновления готовности кабинета.',
      action: 'Обновить статус',
      step: 4
    };
    module.exports.connectionSteps = ['Подтверждения', 'Проверка дополнительных данных', 'Документы', 'Реквизиты'];
    module.exports.initialApprovalLabel = 'Заявка одобрена';
    module.exports.pendingLabel = 'Заявка на рассмотрении';
    module.exports.pendingNote = 'Ожидайте ответа по вашей заявке';
    ;
    return module.exports;
  }();
  m.exports = function () {
    var module = {
      exports: {}
    };
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function (n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }
    module.exports = function ({
      React,
      Modal,
      Navigation,
      Mode,
      Auth,
      Model: M
    }) {
      const {
          useState,
          useEffect,
          useRef
        } = React,
        listeners = new Set();
      let opening = null,
        snapshot = M.initial(),
        requestBack = null,
        changePreviewMode = null;
      function notify() {
        listeners.forEach(f => f());
      }
      function open(page, context = {}) {
        opening = {
          page,
          context
        };
        notify();
      }
      function setScenario(value) {
        snapshot = M.scenario(value);
        changePreviewMode?.(snapshot.profileStage === 'guest-pending' ? 'guest' : 'org');
        notify();
      }
      const icons = {
        arrow: 'm9 5 7 7-7 7',
        back: 'm15 5-7 7 7 7',
        check: 'm5 12 4 4L19 6',
        file: 'M14 3H5v18h14V8z M14 3v5h5 M8 12h8 M8 16h8',
        user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21a8 8 0 0 1 16 0',
        bank: 'M3 8h18L12 3z M5 10v8 M10 10v8 M15 10v8 M20 10v8 M3 21h18',
        shield: 'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7z',
        mail: 'M3 5h18v14H3z M3 5l9 8 9-8',
        exit: 'M9 3H3v18h6 M8 12h13 M16 7l5 5-5 5',
        info: 'M12 7h.01 M12 11v6 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
        clock: 'M12 7v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0'
      };
      const Icon = ({
        name
      }) => React.createElement("svg", {
        viewBox: "0 0 24 24",
        "aria-hidden": "true"
      }, React.createElement("path", {
        d: icons[name] || icons.info
      }));
      const Button = ({
        children,
        kind = 'primary',
        ...p
      }) => React.createElement("button", _extends({
        type: "button",
        className: kind
      }, p), children);
      const Row = ({
        title,
        subtitle,
        icon = 'file',
        onClick,
        disabled
      }) => React.createElement("button", {
        type: "button",
        className: "pa-row",
        onClick: onClick,
        disabled: disabled
      }, React.createElement(Icon, {
        name: icon
      }), React.createElement("span", null, React.createElement("b", null, title), subtitle && React.createElement("small", null, subtitle)), React.createElement(Icon, {
        name: "arrow"
      }));
      const Fact = ({
        label,
        children
      }) => React.createElement("div", {
        className: "pa-fact"
      }, React.createElement("small", null, label), React.createElement("b", null, children || 'Не указано'));
      const Notice = ({
        title,
        children
      }) => React.createElement("div", {
        className: "pa-notice",
        role: "status"
      }, React.createElement("b", null, title), children && React.createElement("p", null, children));
      function Dialog({
        value,
        onClose
      }) {
        const ref = useRef(null);
        useEffect(() => {
          if (value && !ref.current?.open) ref.current?.showModal?.();
          if (!value && ref.current?.open) ref.current.close();
        }, [value]);
        return React.createElement("dialog", {
          ref: ref,
          className: "pa-dialog",
          onCancel: e => {
            e.preventDefault();
            onClose();
          },
          "aria-label": value?.title
        }, value && React.createElement(React.Fragment, null, React.createElement("h2", null, value.title), React.createElement("p", null, value.text), value.buttons.map(([text, fn]) => React.createElement(Button, {
          key: text,
          onClick: fn
        }, text))));
      }
      function useProfileStage() {
        const [stage, set] = useState(snapshot.profileStage || 'connected');
        useEffect(() => {
          const f = () => set(snapshot.profileStage || 'connected');
          listeners.add(f);
          return () => listeners.delete(f);
        }, []);
        return stage;
      }
      function LimitedProfile({
        stage
      }) {
        const item = M.profileStages[stage] || M.profileStages.error;
        function next() {
          parent.postMessage({
            type: 'profile-stage-next',
            stage,
            action: item.action
          }, location.origin);
        }
        return React.createElement("div", {
          className: "profile-additions pa-limited"
        }, React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement("div", {
          className: "pa-stage-status approved"
        }, M.initialApprovalLabel), React.createElement("h2", null, "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435"), React.createElement("h3", null, item.title === 'Подключение' ? 'Продолжение работы' : item.title), React.createElement("p", {
          className: 'pa-stage-detail ' + stage
        }, item.status), React.createElement("p", {
          className: "pa-note"
        }, item.description), item.step != null && React.createElement("ol", {
          className: "pa-steps"
        }, M.connectionSteps.map((name, index) => React.createElement("li", {
          key: name,
          className: item.step > index ? 'done' : item.step === index ? 'current' : ''
        }, React.createElement("span", null, item.step > index ? '✓' : index + 1), React.createElement("div", null, name, React.createElement("small", null, item.step > index ? 'Готово' : item.step === index ? 'Текущий этап' : 'Следующий этап'))))), item.action ? React.createElement(Button, {
          onClick: next
        }, item.action) : React.createElement("div", {
          className: "pa-stage-loading",
          role: "status"
        }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026")));
      }
      function ModeEntry({
        fallback
      }) {
        const stage = useProfileStage();
        return stage === 'guest-pending' ? React.createElement("div", {
          className: "profile-additions pa-pending"
        }, React.createElement("button", {
          type: "button",
          disabled: true,
          "aria-label": M.pendingLabel
        }, React.createElement(Icon, {
          name: "clock"
        }), React.createElement("span", null, React.createElement("b", null, M.pendingLabel), React.createElement("small", null, M.pendingNote)), React.createElement(Icon, {
          name: "info"
        }))) : fallback;
      }
      function ProfileEntry() {
        return React.createElement("section", {
          className: "profile-additions pa-achievements",
          "aria-label": "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"
        }, React.createElement("span", {
          className: "pa-achievement-art",
          "aria-hidden": "true"
        }, React.createElement("svg", {
          viewBox: "0 0 24 24"
        }, React.createElement("circle", {
          cx: "12",
          cy: "8",
          r: "6"
        }), React.createElement("path", {
          d: "m8.21 13.89-1 9.11L12 20l4.79 3-1-9.12"
        }))), React.createElement("div", {
          className: "pa-achievement-copy"
        }, React.createElement("h2", null, "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"), React.createElement("p", null, "\u0412\u0430\u0448\u0430 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u043D\u0430\u0433\u0440\u0430\u0434")), React.createElement("svg", {
          viewBox: "0 0 24 24",
          "aria-hidden": "true"
        }, React.createElement("path", {
          d: "M7 17 17 7M7 7h10v10"
        })));
      }
      function EventsNotifications() {
        const nav = Navigation.useNavigation();
        return React.createElement("button", {
          type: "button",
          className: "pa-events-notifications",
          "aria-label": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F",
          onClick: () => nav.navigate('Notifications')
        }, React.createElement("svg", {
          viewBox: "0 0 24 24",
          "aria-hidden": "true"
        }, React.createElement("path", {
          d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
        })));
      }
      function ProfileAccountRows({
        userId,
        profile,
        onNavigate,
        Row: R,
        disabled
      }) {
        const context = {
          userId,
          profile,
          navigate: onNavigate
        };
        return React.createElement(React.Fragment, null, React.createElement(R, {
          icon: "mail",
          label: "\u041F\u043E\u0447\u0442\u0430 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430",
          disabled: disabled,
          onPress: () => open('contact', context)
        }), React.createElement(R, {
          icon: "shield",
          label: "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u044F",
          disabled: disabled,
          onPress: () => open('consents', context)
        }));
      }
      function SettingsSection({
        mode,
        userId,
        profile,
        onNavigate,
        Row: R,
        Text: T,
        View: V,
        styles,
        disabled
      }) {
        const [teamOpen, setTeamOpen] = React.useState(false),
          teamFrame = React.useRef(null);
        React.useEffect(() => {
          const receive = ev => {
            if (ev.origin === location.origin && ev.source === teamFrame.current?.contentWindow && ev.data?.type === 'gomeet:entry-team:close') setTeamOpen(false);
          };
          window.addEventListener('message', receive);
          return () => window.removeEventListener('message', receive);
        }, []);
        const stage = useProfileStage(),
          context = {
            userId,
            profile,
            navigate: onNavigate
          };
        return mode === 'org' && stage === 'connected' ? React.createElement(V, {
          style: styles.section
        }, React.createElement(T, {
          variant: "label",
          style: styles.sectionLabel
        }, "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440"), React.createElement(V, {
          style: styles.group
        }, React.createElement(R, {
          first: true,
          icon: 'users',
          label: 'Моя команда',
          disabled,
          onPress: () => setTeamOpen(true)
        }), teamOpen ? React.createElement(Modal, {
          visible: true,
          animationType: 'none',
          onRequestClose: () => setTeamOpen(false)
        }, React.createElement('iframe', {
          ref: teamFrame,
          title: 'Моя команда',
          src: '/maintenance/organizer-team-access-20261020/ui-76fd3550e863361e/app.html?case=E32&embed=team',
          sandbox: 'allow-scripts allow-same-origin allow-modals',
          style: {
            display: 'block',
            width: '100%',
            height: '100%',
            minHeight: 0,
            flex: 1,
            border: 0,
            background: '#090909'
          }
        })) : null, [['company', 'user', 'Сведения и статус'], ['bank', 'credit-card', 'Реквизиты для выплат'], ['contracts', 'file-text', 'Документы'], ['limits', 'info', 'Условия и ограничения']].map(([page, icon, label], i) => React.createElement(R, {
          key: page,
          first: false,
          icon: icon,
          label: label,
          disabled: disabled,
          onPress: () => page === 'finance' ? onNavigate('OrgSummary') : open(page, context)
        })))) : null;
      }
      function LogoutEntry({
        Row: R,
        View: V,
        styles,
        userId
      }) {
        return React.createElement(V, {
          style: styles.group
        }, React.createElement(R, {
          first: true,
          icon: "log-out",
          label: "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430",
          disabled: !userId,
          onPress: () => open('logout', {
            userId
          })
        }));
      }
      function Host() {
        const nav = Navigation.useNavigation();
        const [revision, setRevision] = useState(0);
        useEffect(() => {
          const update = () => setRevision(x => x + 1);
          listeners.add(update);
          return () => listeners.delete(update);
        }, []);
        return React.createElement(Modal, {
          visible: !!opening,
          animationType: "none",
          onRequestClose: () => requestBack ? requestBack() : (opening = null, notify())
        }, opening && React.createElement(Pages, {
          key: opening.context.userId || 'demo',
          initialPage: opening.page,
          context: {
            navigate: name => nav.navigate(name),
            ...opening.context
          },
          onClose: () => {
            opening = null;
            notify();
          }
        }));
      }
      function Pages({
        initialPage,
        context,
        onClose
      }) {
        const auth = Auth.useAuth();
        const [page, setPage] = useState(initialPage),
          [history, setHistory] = useState([]),
          [state, setState] = useState(() => structuredClone(snapshot)),
          [form, setForm] = useState(null),
          [base, setBase] = useState(null),
          [errors, setErrors] = useState({}),
          [message, setMessage] = useState(''),
          [busy, setBusy] = useState(false),
          [dialog, setDialog] = useState(null),
          [unknown, setUnknown] = useState(false),
          timer = useRef(null),
          scroll = useRef(null),
          [docBottom, setDocBottom] = useState(false),
          [resultPage, setResultPage] = useState(null),
          [person, setPerson] = useState(null);
        useEffect(() => () => clearTimeout(timer.current), []);
        useEffect(() => {
          if (initialPage !== page) {
            setPage(initialPage);
            setHistory([]);
            setForm(null);
            setBase(null);
            setErrors({});
            setMessage('');
          }
        }, [initialPage]);
        const dirty = !!form && JSON.stringify(form) !== JSON.stringify(base);
        function commitState(next) {
          setState(next);
          snapshot = next;
        }
        function go(next) {
          if (dirty) {
            leave(() => goNow(next));
            return;
          }
          goNow(next);
        }
        function goNow(next) {
          setHistory(h => [...h, page]);
          setPage(next);
          setForm(null);
          setBase(null);
          setErrors({});
          setMessage('');
          setUnknown(false);
          if (scroll.current) scroll.current.scrollTop = 0;
        }
        function leave(action) {
          if (busy || unknown) {
            setDialog({
              title: 'Дождитесь результата',
              text: 'Проверьте результат операции перед выходом.',
              buttons: [['Понятно', () => setDialog(null)]]
            });
            return;
          }
          if (!dirty) {
            action();
            return;
          }
          setDialog({
            title: 'Оставить изменения?',
            text: 'Есть несохранённые изменения.',
            buttons: [['Продолжить редактирование', () => setDialog(null)], ['Выйти без сохранения', () => {
              setDialog(null);
              setForm(null);
              setBase(null);
              action();
            }]]
          });
        }
        function back() {
          leave(() => {
            if (!history.length) {
              onClose();
              return;
            }
            setPage(history[history.length - 1]);
            setHistory(h => h.slice(0, -1));
            setForm(null);
            setBase(null);
            setErrors({});
            setMessage('');
            setUnknown(false);
          });
        }
        useEffect(() => {
          requestBack = back;
          return () => {
            requestBack = null;
          };
        });
        useEffect(() => {
          function f(e) {
            if (dirty || busy || unknown) {
              e.preventDefault();
              e.returnValue = '';
            }
          }
          window.addEventListener('beforeunload', f);
          return () => window.removeEventListener('beforeunload', f);
        }, [dirty, busy, unknown]);
        function existing(name) {
          leave(() => {
            onClose();
            context.navigate?.(name);
          });
        }
        function edit(kind) {
          const value = structuredClone(state[kind]);
          setForm(value);
          setBase(value);
          setErrors({});
          setMessage('');
        }
        function update(key, value) {
          setForm(f => ({
            ...f,
            [key]: value
          }));
          setErrors(e => ({
            ...e,
            [key]: null
          }));
          setMessage('');
        }
        function field(key, label, placeholder, inputMode) {
          return React.createElement("label", {
            className: "pa-field"
          }, React.createElement("span", null, label), React.createElement("input", {
            value: form[key],
            placeholder: placeholder,
            inputMode: inputMode,
            "aria-invalid": !!errors[key],
            disabled: busy || unknown,
            onChange: e => update(key, e.target.value)
          }), errors[key] && React.createElement("small", {
            className: "pa-error"
          }, errors[key]));
        }
        function save(kind) {
          const e = kind === 'company' ? M.validateCompany(form) : M.validateBank(form);
          setErrors(e);
          if (Object.keys(e).length) return;
          setBusy(true);
          setMessage('');
          timer.current = setTimeout(() => {
            setBusy(false);
            if (state.scenario === 'save-error') {
              setMessage('Не удалось сохранить. Введённые значения остались в форме.');
              return;
            }
            if (state.scenario.startsWith('unknown')) {
              setUnknown(true);
              setMessage('Ответ не получен. Проверьте результат перед повторной отправкой.');
              setResultPage(kind);
              return;
            }
            complete(kind);
          }, 450);
        }
        function complete(kind) {
          const next = {
            ...state,
            [kind]: {
              ...form
            },
            ...(kind === 'bank' ? {
              bankState: 'saved'
            } : {})
          };
          commitState(next);
          setForm(null);
          setBase(null);
          setUnknown(false);
          setMessage(kind === 'bank' ? 'Реквизиты сохранены. Проверка счёта не подтверждена.' : 'Сведения сохранены. Статус заявки не изменился.');
        }
        function retry() {
          commitState({
            ...state,
            error: null,
            loading: false
          });
          setMessage('Сведения обновлены.');
        }
        const status = M.states[state.application] || M.states.unknown,
          readError = state.error === 'read',
          denied = state.error === 'access',
          blocked = readError || denied || state.loading;
        return React.createElement("div", {
          className: "profile-additions pa-shell",
          ref: scroll
        }, React.createElement("main", null, React.createElement("header", {
          className: "pa-head"
        }, React.createElement(Button, {
          kind: "back",
          onClick: back,
          "aria-label": "\u041D\u0430\u0437\u0430\u0434"
        }, React.createElement(Icon, {
          name: "back"
        })), React.createElement("span", null, "\u041F\u0440\u043E\u0444\u0438\u043B\u044C")), React.createElement("h1", null, M.titles[page] || 'Профиль'), React.createElement(Notice, {
          title: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440"
        }, "\u041D\u043E\u0432\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u044B \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u043D\u0430 \u043F\u0440\u0438\u043C\u0435\u0440\u0435 \u0434\u0430\u043D\u043D\u044B\u0445. \u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u043D\u0438\u0445 \u043D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435. \u041D\u0435 \u0432\u0432\u043E\u0434\u0438\u0442\u0435 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B."), message && React.createElement(Notice, {
          title: message
        }), " ", unknown && React.createElement(Button, {
          onClick: () => {
            if (state.scenario !== 'unknown-saved') {
              setUnknown(false);
              setMessage('Сохранение не подтверждено. Правки остались в форме.');
            } else complete(resultPage);
          }
        }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442"), blocked ? React.createElement(Notice, {
          title: state.loading ? 'Загружаем сведения…' : denied ? 'Доступ не подтверждён' : 'Не удалось загрузить сведения'
        }, React.createElement("span", null, denied ? 'Эти сведения доступны только владельцу профиля.' : 'Данные не заменены нулями или отметкой об успешной проверке.'), !denied && React.createElement(Button, {
          kind: "secondary",
          onClick: retry
        }, "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C")) : React.createElement(React.Fragment, null, page === 'connection' && React.createElement(React.Fragment, null, React.createElement(Notice, {
          title: status[0]
        }, status[1]), React.createElement("div", {
          className: "pa-group"
        }, React.createElement(Row, {
          title: "\u0421\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u0438 \u0441\u0442\u0430\u0442\u0443\u0441",
          subtitle: "\u0414\u0430\u043D\u043D\u044B\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430 \u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0440\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u0438\u044F",
          icon: "user",
          onClick: () => go('company')
        }), React.createElement(Row, {
          title: "\u0420\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u044B \u0434\u043B\u044F \u0432\u044B\u043F\u043B\u0430\u0442",
          subtitle: state.bankState === 'empty' ? 'Не заполнены' : state.bankState === 'pending' ? 'На проверке' : state.bankState === 'rejected' ? 'Нужны исправления' : 'Сохранены · проверка не подтверждена',
          icon: "bank",
          onClick: () => go('bank')
        }), React.createElement(Row, {
          title: "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B",
          subtitle: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0438 \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
          icon: "file",
          onClick: () => go('contracts')
        }), React.createElement(Row, {
          title: "\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0438 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F",
          subtitle: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435, \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F, \u043F\u0440\u043E\u0434\u0430\u0436\u0438 \u0438 \u0432\u044B\u043F\u043B\u0430\u0442\u044B",
          icon: "shield",
          onClick: () => go('limits')
        }), React.createElement(Row, {
          title: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F",
          subtitle: "\u0417\u0430\u044F\u0432\u043A\u0438, \u0443\u0442\u043E\u0447\u043D\u0435\u043D\u0438\u044F \u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u044F",
          icon: "clock",
          onClick: () => go('history')
        })), state.application === 'needs_information' && React.createElement(Button, {
          onClick: () => go('company')
        }, "\u0418\u0441\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F"), React.createElement("p", {
          className: "pa-note"
        }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F, \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0437\u0430\u044F\u0432\u043A\u0438, \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u0438 \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u043C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F\u043C \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u044E\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u043E.")), page === 'company' && React.createElement(React.Fragment, null, form ? React.createElement(React.Fragment, null, React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement("label", {
          className: "pa-field"
        }, React.createElement("span", null, "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430"), React.createElement("select", {
          value: form.category,
          onChange: e => update('category', e.target.value),
          disabled: busy || unknown
        }, ['Самозанятый', 'Индивидуальный предприниматель', 'Юридическое лицо'].map(t => React.createElement("option", {
          key: t
        }, t)))), field('name', 'Имя или наименование', 'Наименование организатора'), field('inn', 'ИНН', '10 или 12 цифр', 'numeric'), field('city', 'Город', 'Город')), React.createElement("p", {
          className: "pa-note"
        }, "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u0439 \u043D\u0435 \u043E\u0437\u043D\u0430\u0447\u0430\u0435\u0442 \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u0438\u0435 \u0437\u0430\u044F\u0432\u043A\u0438.")) : React.createElement(React.Fragment, null, React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement(Fact, {
          label: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F"
        }, state.company.category), React.createElement(Fact, {
          label: "\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440"
        }, state.company.name), React.createElement(Fact, {
          label: "\u0418\u041D\u041D"
        }, state.company.inn), React.createElement(Fact, {
          label: "\u0413\u043E\u0440\u043E\u0434"
        }, state.company.city), React.createElement(Fact, {
          label: "\u0421\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u044F\u0432\u043A\u0438"
        }, status[0])), M.canEditCompany(state) ? React.createElement(Button, {
          kind: "secondary",
          onClick: () => edit('company')
        }, "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F") : React.createElement(Notice, {
          title: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D"
        }, "\u0421\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u043E\u0433\u043E \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430."), React.createElement("div", {
          className: "pa-group"
        }))), page === 'bank' && React.createElement(React.Fragment, null, form ? React.createElement(React.Fragment, null, React.createElement("div", {
          className: "pa-group pa-pad"
        }, field('recipient', 'Получатель', 'Имя или наименование'), field('bik', 'БИК', '9 цифр', 'numeric'), field('account', 'Расчётный счёт', '20 цифр', 'numeric')), React.createElement("p", {
          className: "pa-note"
        }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u043E\u0432 \u043D\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442 \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0430 \u0441\u0447\u0451\u0442\u0430 \u0438 \u043D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u0437\u0430\u043F\u0440\u043E\u0441 \u043D\u0430 \u0432\u044B\u043F\u043B\u0430\u0442\u0443.")) : React.createElement(React.Fragment, null, React.createElement(Notice, {
          title: state.bankState === 'empty' ? 'Реквизиты не заполнены' : state.bankState === 'pending' ? 'Реквизиты на проверке' : state.bankState === 'rejected' ? 'Реквизиты требуют исправления' : 'Реквизиты сохранены'
        }, state.bankState === 'rejected' ? 'Проверьте данные получателя и счёта.' : state.bankState === 'pending' ? 'Ожидайте результата проверки счёта.' : 'Данные счёта и допуск к выплатам проверяются отдельно.'), state.bank.recipient && React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement(Fact, {
          label: "\u041F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044C"
        }, state.bank.recipient), React.createElement(Fact, {
          label: "\u0411\u0418\u041A"
        }, state.bank.bik), React.createElement(Fact, {
          label: "\u0420\u0430\u0441\u0447\u0451\u0442\u043D\u044B\u0439 \u0441\u0447\u0451\u0442"
        }, '•••• ' + state.bank.account.slice(-4))), React.createElement(Button, {
          kind: "secondary",
          disabled: state.bankState === 'pending',
          onClick: () => edit('bank')
        }, state.bankState === 'empty' ? 'Добавить реквизиты' : 'Изменить реквизиты'))), page === 'contracts' && React.createElement(React.Fragment, null, React.createElement(Notice, {
          title: "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430"
        }, "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0441\u044F \u043A \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0439 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0438. \u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435 \u043E\u0437\u043D\u0430\u0447\u0430\u0435\u0442 \u043F\u0440\u0438\u043D\u044F\u0442\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430."), state.documents === 'sample' ? React.createElement("div", {
          className: "pa-group"
        }, React.createElement(Row, {
          title: "\u041F\u0440\u0438\u043C\u0435\u0440 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0438 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430",
          subtitle: "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \xB7 \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430",
          icon: "file",
          onClick: () => {
            setDocBottom(false);
            go('document');
          }
        })) : React.createElement(Notice, {
          title: state.documents === 'error' ? 'Не удалось загрузить документы' : 'Доступные редакции не получены'
        }, "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D\u043D\u044B\u0439 \u0430\u043A\u0446\u0435\u043F\u0442 \u0437\u0434\u0435\u0441\u044C \u043D\u0435 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D. ", React.createElement(Button, {
          kind: "secondary",
          onClick: () => {
            setMessage('Доступный пакет пока не получен. Попробуйте позже.');
          }
        }, "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443")), React.createElement("div", {
          className: "pa-group"
        })), page === 'document' && React.createElement(React.Fragment, null, React.createElement("p", {
          className: "pa-note"
        }, "\u041F\u0440\u0438\u043C\u0435\u0440 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430 \u0434\u043B\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430. \u041D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0435\u0439 \u0434\u043B\u044F \u0430\u043A\u0446\u0435\u043F\u0442\u0430."), React.createElement("article", {
          className: "pa-document"
        }, React.createElement("h2", null, "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430"), ['Предмет документа', 'Порядок взаимодействия', 'Условия расчётов', 'Изменение и прекращение', 'Сведения о сторонах'].map((t, i) => React.createElement("section", {
          key: t
        }, React.createElement("h3", null, i + 1, ". ", t), React.createElement("p", null, "\u0412 \u0440\u0430\u0431\u043E\u0447\u0435\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435 \u0437\u0434\u0435\u0441\u044C \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u043B\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0439 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0439 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0438 \u0441 \u0435\u0451 \u0434\u0430\u0442\u043E\u0439 \u0438 \u0440\u0435\u043A\u0432\u0438\u0437\u0438\u0442\u0430\u043C\u0438. \u042D\u0442\u043E\u0442 \u043F\u0440\u0438\u043C\u0435\u0440 \u043D\u0435 \u0443\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u043F\u0440\u0430\u0432 \u0438 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432.")))), React.createElement(Button, {
          kind: "secondary",
          onClick: back
        }, "\u041D\u0430\u0437\u0430\u0434 \u043A \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u043C")), page === 'limits' && React.createElement(React.Fragment, null, React.createElement(Notice, {
          title: "\u0414\u043E\u0441\u0442\u0443\u043F \u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F\u043C"
        }, "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0440\u043E\u0444\u0438\u043B\u044F, \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F, \u043F\u0440\u043E\u0434\u0430\u0436\u0438 \u0438 \u0432\u044B\u043F\u043B\u0430\u0442\u044B \u0438\u043C\u0435\u044E\u0442 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F."), React.createElement("div", {
          className: "pa-group pa-pad"
        }, Object.entries({
          create_event: 'Создание события',
          publish_event: 'Публикация события',
          sell_paid: 'Продажа платных билетов',
          receive_payout: 'Получение выплаты'
        }).map(([key, title]) => React.createElement(Fact, {
          key: key,
          label: title
        }, state.allowed[key] === true ? 'Доступно по полученному статусу' : state.allowed[key] === false ? 'Пока недоступно' : 'Доступ не подтверждён'))), React.createElement(Button, {
          kind: "secondary",
          onClick: retry
        }, "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441"), React.createElement("div", {
          className: "pa-group"
        })), page === 'contact' && React.createElement(React.Fragment, null, React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement(Fact, {
          label: "\u041F\u043E\u0447\u0442\u0430 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"
        }, "\u041D\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430 \u044D\u0442\u0438\u043C \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u043E\u043C")), state.error === 'contact' && React.createElement(Notice, {
          title: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043F\u043E\u0447\u0442\u0443"
        }, React.createElement(Button, {
          kind: "secondary",
          onClick: retry
        }, "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C")), React.createElement("p", {
          className: "pa-note"
        }, "\u041A\u043E\u043D\u0442\u0430\u043A\u0442 \u0438\u0437 \u0430\u043D\u043A\u0435\u0442\u044B \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430 \u0438 \u043F\u043E\u0447\u0442\u0430 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u044E\u0442\u0441\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E."), React.createElement(Button, {
          disabled: true
        }, "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043F\u043E\u0447\u0442\u044B \u043F\u043E\u043A\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E")), page === 'consents' && React.createElement(React.Fragment, null, React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement("label", {
          className: "pa-switch"
        }, React.createElement("span", null, React.createElement("b", null, "\u041E\u0442\u0447\u0451\u0442\u044B \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0430\u0445"), React.createElement("small", null, "\u041F\u043E\u043C\u043E\u0433\u0430\u044E\u0442 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u0442\u044C \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u0431\u043E\u0438")), React.createElement("input", {
          type: "checkbox",
          checked: state.diagnostics,
          disabled: busy,
          onChange: e => {
            const value = e.target.checked;
            setBusy(true);
            timer.current = setTimeout(() => {
              setBusy(false);
              if (state.scenario === 'diagnostics-error') {
                setMessage('Не удалось сохранить выбор. Прежняя настройка сохранена.');
                return;
              }
              commitState({
                ...state,
                diagnostics: value
              });
              setMessage(value ? 'Передача отчётов включена.' : 'Передача отчётов выключена.');
            }, 350);
          }
        }))), React.createElement("div", {
          className: "pa-group"
        }, React.createElement(Row, {
          title: "\u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044F",
          subtitle: "\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0435 \u0438 \u043B\u0438\u0447\u043D\u044B\u0435 \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F",
          icon: "shield",
          onClick: () => go('visibility')
        })), React.createElement(Notice, {
          title: "\u0414\u0440\u0443\u0433\u0438\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u044F"
        }, "\u041E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0435 \u0441\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u0438 \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B."), React.createElement(Button, {
          kind: "secondary",
          onClick: () => existing('About')
        }, "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B \u0441\u0435\u0440\u0432\u0438\u0441\u0430")), page === 'visibility' && React.createElement(React.Fragment, null, React.createElement(Notice, {
          title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B"
        }, "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0433\u043E \u0438\u043B\u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u043E\u0433\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u044D\u0442\u043E\u0439 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438. \u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F."), React.createElement(Button, {
          disabled: true
        }, "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0438\u043B\u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C"), React.createElement(Button, {
          kind: "secondary",
          disabled: true
        }, "\u0418\u043C\u044F, \u0444\u043E\u0442\u043E \u0438 \u0443\u0447\u0430\u0441\u0442\u0438\u0435")), page === 'followers' && React.createElement(React.Fragment, null, state.followers.length ? React.createElement("div", {
          className: "pa-group"
        }, state.followers.map(p => React.createElement(Row, {
          key: p.id,
          title: p.name,
          subtitle: '@' + p.username + ' · ' + p.city,
          icon: "user",
          onClick: () => {
            setPerson(p);
            go('person');
          }
        }))) : React.createElement(Notice, {
          title: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u043F\u0440\u043E\u0444\u0438\u043B\u0435\u0439"
        }, "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A\u0438, \u0447\u044C\u0438 \u043F\u0440\u043E\u0444\u0438\u043B\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430."), React.createElement("div", {
          className: "pa-group"
        }, React.createElement(Row, {
          title: "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044F",
          icon: "shield",
          onClick: () => go('visibility')
        }))), page === 'person' && person && React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement("div", {
          className: "pa-person"
        }, React.createElement(Icon, {
          name: "user"
        }), React.createElement("h2", null, person.name), React.createElement("p", null, "@", person.username, " \xB7 ", person.city)), React.createElement("p", {
          className: "pa-note"
        }, "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0434\u043B\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0430 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430.")), page === 'history' && React.createElement("div", {
          className: "pa-group pa-pad"
        }, React.createElement(Fact, {
          label: "\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435"
        }, status[0]), React.createElement("p", {
          className: "pa-note"
        }, status[1]), state.application === 'needs_information' && React.createElement(Notice, {
          title: "\u0417\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u043E \u0443\u0442\u043E\u0447\u043D\u0435\u043D\u0438\u0435"
        }, "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0438\u043C\u044F \u0438\u043B\u0438 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0442\u043E\u0440\u0430 \u0432 \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F\u0445."), state.application === 'rejected' && React.createElement(Notice, {
          title: "\u0420\u0435\u0448\u0435\u043D\u0438\u0435 \u043F\u043E \u0437\u0430\u044F\u0432\u043A\u0435"
        }, "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0441\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0437\u0430\u043C\u0435\u0447\u0430\u043D\u0438\u044F \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u043C \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C."), React.createElement("p", {
          className: "pa-note"
        }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0432\u0435\u0440\u0441\u0438\u0438 \u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u0438.")), page === 'logout' && React.createElement(React.Fragment, null, React.createElement(Notice, {
          title: "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430?"
        }, "\u041F\u043E\u0441\u043B\u0435 \u0432\u044B\u0445\u043E\u0434\u0430 \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0443 \u043F\u043E\u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0441\u043D\u043E\u0432\u0430 \u0432\u043E\u0439\u0442\u0438 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442."), React.createElement(Button, {
          onClick: () => {
            onClose();
            auth.signOut();
          }
        }, "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"), React.createElement(Button, {
          kind: "secondary",
          onClick: back
        }, "\u041E\u0441\u0442\u0430\u0442\u044C\u0441\u044F \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0435")), page === 'signedout' && React.createElement(React.Fragment, null, React.createElement(Notice, {
          title: "\u0412\u044B \u0432\u044B\u0448\u043B\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"
        }, "\u0412\u043E\u0439\u0434\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0432\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0438 \u0441\u043E\u0431\u044B\u0442\u0438\u044F."), React.createElement(Button, {
          onClick: onClose
        }, "\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0443")), !['logout', 'signedout', 'document', 'visibility', 'followers', 'person'].includes(page) && React.createElement("button", {
          className: "pa-support",
          onClick: () => existing('Support')
        }, "\u041E\u0431\u0440\u0430\u0442\u0438\u0442\u044C\u0441\u044F \u0432 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443"))), form && React.createElement("footer", {
          className: "pa-footer"
        }, React.createElement(Button, {
          kind: "secondary",
          onClick: () => leave(() => {
            setForm(null);
            setBase(null);
          }),
          disabled: busy
        }, "\u041E\u0442\u043C\u0435\u043D\u0430"), React.createElement(Button, {
          onClick: () => save(page),
          disabled: !dirty || busy || unknown
        }, busy ? 'Сохраняем…' : 'Сохранить')), React.createElement(Dialog, {
          value: dialog,
          onClose: () => setDialog(null)
        }));
      }
      return {
        open,
        Host,
        EventsNotifications,
        ModeEntry,
        useProfileStage,
        LimitedProfile,
        ProfileEntry,
        ProfileAccountRows,
        SettingsSection,
        LogoutEntry
      };
    };
    ;
    return module.exports;
  }()({
    React,
    Modal,
    Navigation,
    Mode,
    Auth,
    Model
  });
}, 1641, [36, 1011, 142, 1006, 1007]);