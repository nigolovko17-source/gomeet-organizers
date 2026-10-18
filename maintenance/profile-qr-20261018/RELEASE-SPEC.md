# QR-код профиля — принятый концепт / подготовка публикации

UI-PROFILE-QR-20261018 · 18.10.2026. Пользователь разрешил публикацию принятого r1. Пользователь отдельно уточнил: убрать подпись «Наведите камеру, чтобы открыть профиль». В r2 удаляется только её JSX строка, QRStyle и остальная композиция r1 сохранены.

Target organizers web, sourcea8aa2f42ad2c013f39c367f7b90129963a8fc30c, bundle9bba1c50f77cbb89f35785b36da885ff / SHA256a2c6d236f02284f5e6270641fb78afb972eda40c6935f4c5850a19b53ba6b9af. Только1494/deps (+Avatar1334): меняется тело QR и добавляется helper. Исходный Settings AST после удаления замены/добавленного helper должен совпасть; preview auto-open в production отсутствует. Остальные1639 factories и прочие deps/linking1033/QR1495/profile hooks/backend/SDK/permissions прежние. Существующий QR Modal/Sheet/крестик и Murs/Onest/принятые QRStyle сохранены.

Production получает текущие profile/name/username/avatarUrl, исходный profileLink (guest→people, org→organizers) и original reload U. Предпросмотровой замены origin нет. QR value и clipboard используют одну существующую ссылку, без новых query/параметров/приватных данных. Нет публикации fixtures, mock timers/postMessage/forced states или автоматического открытия QR.

Кнопка вызывает navigator.clipboard.writeText только по явному действию. Успех — после fulfilled, reject/unavailable сохраняют ошибку/повтор. Lock исключает дубли; mounted/epoch/current identity+URL защищают от stale completion после close/unmount/identity/mode/read change. Пока loading/failed/empty link, QR отсутствует и копирование выключено. Retry — прежний reload, без изменения профиля/роли. Key карточки привязан к owner+mode, прежние canOrganize/routes/privacy не меняются. Начальный focus на крестике, клавиатура и44+px сохраняются.

## Baseline / критерии

- GOV-001/002/003, RT-001 DEC: target/source/hash/original/accepted styles, отдельные build/tests/GUI/publication/rollback evidence.
- PD-04/06, RT-005 DOC: условия проектов, утверждение/полная применимость отдельно. Публичная проекция/круг зрителей не расширяются UI; owner QR не заменяет серверный consent. Source DTO/link/QR сохраняются, никаких email/телефонов/согласий/заказов в коде/clipboard не добавляется. Viewer owner/other/anon/privacy/RLS acceptance этим выпуском не закрывается.
- RT-003 OPEN: прежний optional avatar и fallback, обязательное фото/новая аудитория не вводятся.

[Реестр](../../../../product/LEGAL-BASELINE.md), [источники](../../../../business/legal-baseline-2026-10-15/LEGAL-ANALYSIS.md), [матрица](../../../../design/LEGAL-TRACEABILITY.md). Achievements, QR билета и отложенные финансовые/поддержка/жалобы не меняются. LGL не закрыты.

Проверка до публикации: JSX/scope/QRStyle AST, mock clipboard pending/success/reject/unavailable/duplicate/key/stale/unmount/loading/error/retry, реальный clipboard browser по user action с восстановлением прежнего буфера при возможности;320/390/fonts/close/Escape, оба режима URL на stubs, offline QR decode. В production не переключать режим/профиль/согласия для QA, не отправлять внешние сообщения. После push exact Pages commit/HTTPS hashes/live QR/fonts/caption/Back/copy. Server/privacy/RLS/native/physical handset отдельно. Принятие удаления подписи: прямой ответ пользователя «Убрать подпись»; публикация подтверждается отдельным PUBLICATION.json.
