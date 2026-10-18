# «О приложении» — принятый вариант r2 / публикация

UI-ABOUT-20261018 · 18.10.2026. Прямое поручение пользователя: убрать карточку GOMEET и опубликовать. Порядок: «О приложении» → «Документы» → «Диагностика». Исходные Murs Gothic/Onest и остальные стили принятого r1 сохраняются. Рамки разделов/отступы остаются; удаляется только brand JSX и его три стиля.

Среда: organizers web, база94d8d1ebfbe958f4135d3ee6d0ab7b3a7e303ee0 / bundle5755bc66fd8428032cf085d8956ff35b, SHA2564c140b2d69c1144035179eb241ea3aff1d42024c867b9d70a6415fe13a5ab9ef. Меняется только фабрика1588 и её deps (+1422/948/36). Остальные1639 factories и прочие dependency maps должны быть byte-identical. Linking1033, LEGAL_URL/LEGAL_VERSION1032 и useDiagnosticsConsent1041→1106 остаются прежними. Старый bundle и исходный1588 сохранены.

Production использует прежние useGoBack/useAuth/useDiagnosticsConsent. T.set вызывается только по явному действию пользователя, возвращает void; loading/saving/allowed/error/needsSync выводятся из hook, оптимистического согласия/автоматического сохранения нет. Сохраняются actual error и fail-safe off с явным retry(false). После ошибки включения повтор — явный set(true). При отсутствии userId switch disabled, документы доступны. Клавиатура Space/Enter и явный aria-checked сохранены. Никакие preview state/timer/postMessage/данные не входят в production.

Документы открываются через исходный Linking.openURL и текущие LEGAL_URL terms/privacy. Их содержание, версии, источник и акцепт не меняются. Другие экраны, достижения, отложенные ticket/report/block confirmation/support, БД/RLS/SDK/transport не меняются.

## Применимые основания и приёмка

- GOV-001/002/003, RT-001 **DEC**: выбранная среда/база, точная область, реализация/проверка/публикация раздельно — RELEASE-BUILD/TEST/GUI, INSTALL, PUBLICATION.
- PD-02/03, RT-006 **DOC**: применимость/утверждение проектов не устанавливается UI; отдельное добровольное действие, исходное unknown/off/loading не становится согласием, документы доступны при отказе/ошибке. Проверка на заглушках: no auto-save, busy/anonymous guard, error/pending-off/retry false. История/серверный отзыв/доставка не доказываются рисунком switch.
- PD-19, RT-016 **OPEN**: диагностика не переименовывается во всю аналитику; нет обещания анонимности или полного отсутствия журналов. Получатели/retention/правовые основания этим выпуском не решаются.

Источники: [LEGAL-BASELINE](../../../../product/LEGAL-BASELINE.md), [RT-006/016 анализ](../../../../business/legal-baseline-2026-10-15/LEGAL-ANALYSIS.md), [дизайн-матрица](../../../../design/LEGAL-TRACEABILITY.md). Общие LGL-004/008 и server/privacy/native/handset приёмка не закрываются.

Проверка: JSX/scope/styles AST, mock hook states/actions/no mount writes,320/390 без overflow/fonts/controls≥44, local actual-hook read без смены настройки, direct/internal/back/reload, точный Pages commit и HTTPS SHA всех release files. Реальная диагностика и согласия при QA не переключаются; server consent/history/delivery/withdrawal — NOT RUN. Публикация подтверждается отдельно PUBLICATION.json.
