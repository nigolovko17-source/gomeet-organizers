# Обложки прошедших событий в сообщениях —18.10.2026

UI-MESSAGE-COVERS-20261018 / D-060. Прямое поручение: исправить и опубликовать показ фото события в списке сообщений после завершения события. Base17490225dba9afc996f31208a670cadcc00c0e5b, runtime index-3f184a8d1d715491d9c16baa5b039059.js/SHA2560cf046d3bf7b7c7dd4b1d7775026ce5b6f92b2913513faba6f86674b9d4ad34a.

Причина:1487 ищет событие/обложку через useFeed;1320 исключает завершённые события, хотя1493/useEventChats уже получает полные события по ID через fetchEventsByIds без фильтра даты. Из1493 projection imageUri теряется.

Решение: сохранить imageUri из уже загруженного события в event-chat projection;1487 использует сам chat как источник id/palette/imageUri для прежнего Media, без useFeed/extra API. Реальные ID/набор чатов/preview/time/sort/auth/Chat1579/send/report/data access прежние. Для отсутствующей/недоступной обложки прежний Media fallback; фикс не создаёт фото и не восстанавливает удалённые Storage assets. Только1487/1493 factories, deps сохраняются; остальные1638 factories и все maps byte-exact.

GOV-001/002 и RT-001 DEC: точная версия/env/реализация/проверка/публикация раздельно. PD-04/05 и RT-005 DOC (условия проектов; утверждение/акцепт не установлены): только публичная обложка уже разрешённого события из прежнего fetchByIds, без новых профилей/контактов/истории/запросов и без изменения RLS. PD-08/09 DOC не считаются исполненными этим фиксом; LGL-004/008/server/consent/native отдельно. Источники product/LEGAL-BASELINE.md, design/LEGAL-TRACEABILITY.md. D-059 сохраняет запрет публиковать mock-переписки/читать реальные истории ради демонстрации; здесь проверяется только metadata/картинки списка, внутрь чата не заходим.

Критерии: isolated actual-source projection сохраняет imageUri у past/future/no-cover; renderer не вызывает useFeed и передаёт прежнему Media cover по ID; сетевых дополнительных запросов/мутаций нет. Local browser список/изображения, live после exact Pages/HTTPS — фото у ранее ticket-only rows, поиск/clear/390px. Без оформления новой UI/фикстур на сайте. Один scoped commit/push, старый1749022/bundle сохранён. До evidence: публикация PENDING.
