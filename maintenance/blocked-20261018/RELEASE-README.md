# «Заблокированные» — production r2

UI-BLOCKED-20261018 · 18.10.2026. Публикация по прямому поручению пользователя после принятия локального r2.

Принятое оформление сохранено: без информационной плашки, Murs Gothic/Onest, один список, компактная разблокировка. Production использует прежние реальные Avatar/ID/owner-session transport. Вымышленные профили/кружки/forced states/preview timers не входят в active UI или этот пакет исходников.

[RELEASE-SPEC](RELEASE-SPEC.md) фиксирует границы и baseline. [BUILD](RELEASE-BUILD.json), [STYLE](ACCEPTED-STYLE.json), [TEST](RELEASE-TEST.json), [CHECK](RELEASE-CHECK.json), [INSTALL](INSTALL.json) — отдельные технические свидетельства. Их pre-publish PENDING поля исторические; итог после выпуска находится в design/blocked-concept-20261018/r2/PUBLICATION.json и LIVE-CHECK.json.

Воспроизведение: из корня этого репозитория `node maintenance/blocked-20261018/build-release.cjs`, затем синтаксическая проверка candidate.js. Основа6be8b82 и его прежний bundle сохранены. Сборка требует опубликованные production source/helper/STYLE; локальные mock renderer/harness не требуются. `install-release.cjs` заменяет только три активных entry и записывает новый hashed bundle после проверки базы; повторно поверх другой версии не запускается.

Только1033/1325/1587/deps1587. Новый strict read export1325 не меняет существующие exports, DELETE/cache invalidation, auth/backend/RLS/SDK/миграции. Queries/поля прежние; error/null/partial не выдаются за пустой успех. Строка удаляется лишь после прежнего true, error сохраняет её, busy/stale/account/focus completion ограничены текущим экраном. Настройки/достижения/прочие экраны сохранены.

На QA реальных block/unblock/profile/follow/chat writes0.21 isolated React/transport проверок; реальный текущий список и браузерные переходы проверяются read-only. Полная серверная owner/other/anon/privacy/consent/RLS/native приёмка и реальный DELETE отдельно. Наличие нового UI не закрывает LGL-004/008 или остальные baseline критерии.
