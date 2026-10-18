# «Заблокированные» — публикация принятого r2

UI-BLOCKED-20261018 · 18.10.2026 · прямое поручение пользователя: «Опубликуем этот вариант страницы … на сайте». Принятый r2 без информационной плашки; исходные Murs/Onest и все стили S сохранены. Сайт назначения — https://gomeet-organizers.ru, основа6be8b82/bundlee5e438… SHA9276cb53…8ce. Прежний выпуск остаётся для отката.

## Реализация

- Factory1587: реальный список и действия вместо local fixtures/timers/postMessage. useFocusEffect, useAuth и generation/identity refs ограничивают завершения текущим экраном/аккаунтом. При loading/error/без userId действия отсутствуют; запрос без userId не делается. Back использует исходный useGoBack: внутренний вход возвращается в профиль, initial direct entry без истории — в Home. Это прежняя навигация, закрывающая настройки до перехода. Подпись accessibility уточняется соответственно; новый механизм открытия настроек не добавляется.
- listBlockedStrict добавлен в1325 как отдельный export, исходные exports/listBlocked/unblockUser/blockedIds/cache invalidation не меняются. Те же2 SELECT: blocks(blocked_id), затем profiles(id,name,username,avatar_url) по прежним IDs. Supabase error/null/malformed/неполная проекция не изображаются пустым списком. Полный пустой успешный blocks→empty. Недоступные profiles не обходятся новым ACL/RPC: экран ошибки с Retry. SDK/схема/сервер/RLS/auth/кэш прежние, новых endpoint/колонок/публичной видимости нет.
- Разблокировка вызывает прежний unblockUser(id), блокирует повтор и оставляет строку до true. False/rejection сохраняют строку и показывают ошибку; true удаляет ровно её. Stale/blur/unmount/account-switch completion игнорируется. Транспортный DELETE/filter и invalidateQueries неизменны. Это не новая серверная проверка количества затронутых строк; существующий bool-контракт сохранён, real DELETE не используется для QA.
- Avatar1334 с исходными name/avatarUrl/design2026/size40 заменяет только demo-круг. Фото/отсутствующее фото имеют прежнее поведение Avatar. Синтетические имена/IDs, forced states и тестовые подмены не входят в active bundle или публикуемые исходники.
-1033: один Blocked path alias, чтобы initial/reload открывал тот же экран, что внутренний переход. Остальная linking config AST прежняя. Только1033/1325/1587, deps1587 (+Feather1422/ScrollView319/Auth1007), остальные1637 factories/deps прежние. Общие стили, настройки1494, остальные уже принятые страницы, новая система достижений и отложенные подтверждение блокировки/жалобы не меняются.

## Применимость baseline

| ID / тип | Критерий этой версии | Проверка и граница |
|---|---|---|
| GOV-001/002/003, RT-001 DEC | Source/acceptance/implementation/check/publication раздельно, оригиналы сохранены. | BUILD/TEST/CHECK/INSTALL, затем Pages/HTTPS/live/PUBLICATION. Макет не выдаётся за server acceptance. |
| PD-04/05, RT-005 DOC | Условия проектов, акцепт/применимость не установлены; не расширять чужую видимость/граф. | Те же owner-session queries/поля/Avatar. Реальная текущая выдача read проверяется, owner/other/anon/RLS/privacy/consent матрица NOT RUN, LGL-004/008 не закрыты. |
| PD-08 DOC | Существующее пользовательское снятие блока; новых Chat/follow/автоподписок нет. | Mock true/false/reject/duplicate/stale, source original unblockUser AST прежний; реальные отношения/DELETE/server semantics NOT RUN. Удаление подсказки r2 не меняет эти правила. |
| PD-09 DOC, граница | Не проектировать санкции сервиса/акцепты/контентную модерацию. | Нет нового enforcement/consent; server/модерация NOT RUN. |
| D-048 DEC | Жалобы/подтверждение блокировки/поддержка — последний этап. | Здесь только уже существующий список и разблокировка; новые отложенные экраны не включены. |

Источники: [baseline](../../../../product/LEGAL-BASELINE.md), [подробный PD-08/09/RT-005](../../../../business/legal-baseline-2026-10-15/LEGAL-ANALYSIS.md#pd-08), [локальный r2](../../../../design/blocked-concept-20261018/r2/README.md), SPEC.md. Supabase select/delete docs и changelog прочитаны; существующая цепочка API и pinned SDK не обновляются. Без service_role, новых токенов/ролей/грантов/permissions или миграций.

## Проверка и выпуск

Изолированные React/transport проверки: successful empty/list/Avatar, исходные строки/нет плашки/fixtures, read error/retry/loading/anonymous/service/malformed/partial, true/false/reject/duplicate/unmount/blur/account-switch/stale read, Back; helper same queries/default exports. Вымышленные данные harness не публикуются.

Предпубликационный GUI — реальный текущий owner read/empty, внутренний вход, direct/reload, Back,390/320/fonts. Полный список/ошибки/снятие блока покрываются изолированными тестами; не создаём настоящие блокировки ради демонстрации. Затем один scoped commit, push main, Pages exact commit, HTTPS SHA256, live direct/reload/internal/Back/PNG. До этих свидетельств publication PENDING.
