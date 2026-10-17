# Настройки профиля — production r2

UI-PROFILE-SETTINGS-20261018. Прямое поручение пользователя18.10.2026: опубликовать принятый r2 настроек профиля. Composition r1 и кнопка r2 приняты; исходные шрифты GOMEET/геометрия r2 сохраняются.

## Версия и установка

Основа **ecda6a958d424df62f6852c1ac727dea939b23f9**, bundle71c79e111e8cdf7cc6527659a6b67242 / SHA256e1c4f6af2c5a9a5b72e0f5c190e8059e326a60692bc8298abcd07a4ce749fb37. Target https://gomeet-organizers.ru, существующая кнопка шестерёнки `/profile`.

Меняется только factory1494 и его dependency map (+Feather1422, SafeArea414).1639 остальных factories byte-exact, в том числе1529 Me,1601 editor,1602 read/save,1006 mode,1007 auth,1320 profile,1536 applications,1624 Verification,141 navigation,1033 URLs. Новых routes/API/schema/RLS/пакетов нет. Existing Modal становится принятым full-screen settings, Back закрывает его; tab bar и профиль остаются под Modal. Изолированный local1601/1033 preview не входит в выпуск.

SettingsPanel.production.jsx и SettingsRow/styles — принятый r2 без forced states/postMessage/notices/preview flags. ACCEPTED-STYLE.json фиксирует AST styles и Row; build-release.cjs проверяет совпадение, source scope и сохранность остального1494. ProfileSettings.production.jsx — воспроизводимый полный1494. Локальные reviewer/fixtures/check-release.cjs/candidate/source snapshots не публикуются.

## Действия и состояния

- Готовность режима берётся из существующего useMode.ready. Пока unknown, верхнее действие disabled. canOrganize=false → navigate Verification, без setMode/becomeOrganizer/INSERT/акцепта. true+guest → старый setMode(org); true+org → setMode(guest). После действия меню закрывается.
- Редактировать→EditProfile, билеты→Tickets, заблокированные→Blocked, поддержка→Support, о приложении→About. Условные Проверка ИНН→Verification, модерация→Moderation, обращения→SupportQueue, выплаты→Payouts сохраняют исходные predicates.
- Все навигационные действия сначала закрывают Modal. Показ билетов использует прежний purchases aggregate, без fixture count.
- Ссылка использует оригинальный clipboard handler1494 и guest/org profileLink1033. При успехе Modal закрывается; при отказе копирования прежний error показывается в настройках, повтор доступен.
- QR использует прежний отдельный Modal/Sheet1023/renderer1495/owner link, без нового QR-дизайна; закрытие возвращает в профиль как прежде.
- Реальные profile loading/failed1320 показывают состояние и блокируют зависимые edit/copy/QR, retry вызывает прежний reload. Не меняются read/fallback контракты1320 или ecda6a9 guard1602. При anonymous сохраняется прежняя информирующая card1535; выключенные logout/delete controls и оригинальные dialogs остаются выключенными.

## Baseline и границы

| ID / тип | Применимость и версия | Критерий / evidence | Статус |
|---|---|---|---|
| GOV-001/002, RT-001 DEC | Выпуск organizers ecda6a9→production-r2 | Источник, acceptance, implementation, tests и publication различаются: BUILD/TEST/CHECK/INSTALL, затем PUBLICATION/live | Реализация/предпубликационные проверки отдельно от Pages |
| PD-04, RT-005 DOC | Owner settings/link/QR; проекты документов автоматически не утверждены | Original links/audience/read hooks прежние, новых visibility/consent controls нет; server owner/other/anon/RLS acceptance не заявляется | Сохранён frontend scope; LGL-004/008 отдельно |
| ORG-001/003, RT-013 DOC | Новый вид entry ведёт в уже зарегистрированный Verification1624 | Entry не выдаёт роль, не отправляет заявку и не акцептует документы. Auth/mode/server functions неизменны | Проверяется маршрут и отсутствие мутации; весь ORG-ONB и enrollment gates не закрываются |
| RT-011 PROP | Ошибка профиля/unknown state | Зависимые действия блокируются по существующему failed/loading, Retry настоящий | Frontend states проверяются stub transport; actual RPC fault injection отдельно |
| D-048 DEC | Ticket/block/support final detail отложены | Здесь только существующие входы, detail/покупки/жалобы/блокировки/обращения не переделываются | Сохранён scope |

Обнаруженное различие версий: этот organizers domain использует старый Verification1624 с ИНН и старой отправкой заявки; новый полный ORG-ONB из product handoff относится к другому frontend/окружению. Данный выпуск только направляет в существующий маршрут, не включает новый enrollment и не подтверждает согласованность старых обещаний/серверных gates с DOC. Нельзя выдавать вход «Стать организатором» за завершение всего подключения. Связь: ORG-ONB-20261016, LGL-003/004, прежний RT-013 статус сохраняется.

Источники: product/LEGAL-BASELINE.md, business/legal-baseline-2026-10-15/LEGAL-ANALYSIS.md#org-001 и #rt-013; product/ORGANIZER-ONBOARDING-COORDINATOR-HANDOFF.md. Продуктовые ограничения описаны в локальном SPEC.md; исторический r2 в design/profile-settings-concept-20261018/r2.

## Проверка и публикация

16 isolated React checks: обе ветки подключённого режима и новый entry, unknown readiness, loading/failed/reload/recovery, обычные и условные routes, отсутствие запрещённых rows, guest/org copy/error, QR/close и hidden account actions. Без реальных профилей/clipboard/заявок/выдачи роли в stub tests. Browser preflight: настоящие owner reads/390/320/fonts, открыть/закрыть, mode→guest обратно, QR, editor→Back. Никаких заявок, акцептов, profile saves, ticket/payment/block/support submissions во время QA.

Pages exact commit, HTTPS SHA256 и live проверка фиксируются после публикации в design/profile-settings-concept-20261018/r2/PUBLICATION.json, отдельно от pre-publish receipts. Серверные privacy/consent/gates/native и физический handset — NOT RUN. Canonical app/web/site-main и Me r5/новая система достижений не меняются.
