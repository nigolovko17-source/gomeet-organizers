# Лента — принятый r4, выпуск

UI-FEED-20261018.18.10.2026 пользователь принял r4 и прямо поручил публикацию на gomeet-organizers.ru. Принятый вид: без верхних заголовка/счётчика/«сейчас»; прежний информационный блок с «О событии», дата/время/место внутри; новый ряд «Иду + цена» и сердце48px. Очередь D-048 сохраняется: редизайн оформления/билета/жалоб/блокировки/поддержки позже.

## Версия и воспроизведение

Target: organizers web Explore /explore. База1985dffdb1f0a8803659464086f3b7916d966b4e, runtime3f09737a…/SHA25606f53256…. Принятый source и preview: BUILD.json; исторические локальные проверки: CHECK.json и design/feed-concept-20261018/r1…r4. Полный локальный паспорт сохранён в LOCAL-SPEC-r4.md.

ExploreScreen.jsx — неизменённый принятый r4; published-explore.js / published-deps.json — исходный1483/deps. Команда node maintenance/feed-20261018/build.cjs воспроизводит preview. Команда node maintenance/feed-20261018/build-release.cjs удаляет preview/state/notice/local favorite и возвращает прежние useSaved.toggle, feed.refresh и Purchase callback. ExploreScreen.production.js — читаемый production source, RELEASE-BUILD.json — точные хеши и границы, RELEASE-CHECK.json — локальный preflight.

Только1483 меняется; остальные1639 factories и все dependency maps byte-exact. Весь принятый JSX/styles проверяется AST hash и сохраняется. Оригинальные useFeed/useEvent/useGoing/useGoingMap/useSaved, порядок, цены, фотографии, публичная проекция, нижняя навигация и API/backend не меняются. «Билет у вас» по-прежнему открывает афишу; «Иду» — прежнее оформление. Это сохранение существующих переходов, без нового checkout/выдачи билетов или изменения платёжных правил. Preview/viewer/candidate/release-preview output в публикацию не входят; старый runtime сохраняется.

## Применимость и проверка

[LEGAL-BASELINE](../../../../product/LEGAL-BASELINE.md), [полный локальный паспорт](LOCAL-SPEC-r4.md), [матрица дизайна](../../../../design/LEGAL-TRACEABILITY.md).

GOV-001/002, RT-001 — DEC: exact source/build/environment и раздельные local/release/publication receipts. PAY-001/RT-013 — DOC, LEG-007 — OPEN: исходная цена и существующие переходы сохранены, коммерческая/финансовая приёмка и документы отдельно. PD-04/06/RT-005 — DOC: прежний organizer/public DTO, новые участники/соцграф/контакты не добавляются; серверная RLS/viewer/consent матрица не закрывается. PD-19/RT-016 — OPEN: новых metric callbacks нет, raw analytics/retention не квалифицируются.

Критерии локального preflight: принятый r4/нет верхних подписей, About metadata/open-close, snap/цена/переход к билетам без оформления/афиша/Back к странице3,320/390px и48px, syntax/module scope. Фактический итог RELEASE-CHECK.json. Реальные избранное/подписки/жалобы/блокировки/сообщения/платежи в QA не выполняются. Physical handset/native/screen-reader/reduced-motion, server/consent/legal/financial acceptance отдельно. App/web/site/main не редактировались.

После публикации Pages/HTTPS/live и PNG сохраняются отдельно в design/feed-concept-20261018/r4/PUBLICATION.json и HTTPS-CHECK.json. Исторические local BUILD/CHECK и preflight с PENDING не переписываются как доказательство публикации.
