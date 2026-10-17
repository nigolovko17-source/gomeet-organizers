# Оформление переписки — принятый r2

UI-DM-20261018, публикация frontend-кода по D-059, без публикации/вставки демонстрационных диалогов. Основа8ba4fb4.

ChatScreen.production.js — source без sample arrays/имён/текстов. build-release.cjs требует локальный принятый источник из design/chat-concept-20261018/r2 (или локальный maintenance/ChatScreen.jsx), который намеренно не публикуется. BUILD/RELEASE-BUILD фиксируют provenance/scope; RELEASE-SPEC-r2.md — критерии/границы; RELEASE-TEST/RELEASE-CHECK — проверку без чтения реальных переписок. Итог Pages/HTTPS/active bundle в design/chat-concept-20261018/r2/PUBLICATION.json.

Только1579 factory/deps,1639 остальных/1493 hooks/1487 Messages прежние. Исходные data/send/report контракты сохранены, без новых backend операций/прав. Local-only samples/reviewer/concept/empty QA stubs/check-release source не включены в public commit. Layout сохраняется для реальных сообщений, когда пользователь сам открывает существующий чат; никаких sample records не добавляется.

Проверка:11 isolated React checks + пустые390/event и320/personal browser templates без chat transport. Реальные истории/отправка/live-populated demo, native/consent/RLS не проверялись; ограничения указаны в паспорте. Старый8ba4fb4/bundle остаётся для отката.
