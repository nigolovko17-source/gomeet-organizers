# Фото событий в сообщениях после завершения

UI-MESSAGE-COVERS-20261018 / D-060. Исправляет источник обложки: imageUri уже разрешённого события сохраняется в useEventChats, строка получает обложку из chat metadata без поиска в актуальном useFeed.

Исходники MessagesScreen.jsx и ChatHooks.js; builder build.cjs. Проверка: node maintenance/message-covers-20261018/build.cjs; node maintenance/message-covers-20261018/check.cjs; node --check maintenance/message-covers-20261018/candidate.js.

SPEC.md — scope/основания, BUILD.json — exact1749022 base/hash, TEST.json —7 isolated regression checks, CHECK.json — local browser9/9 images вместо2/9 и320/390. Только1487/1493 factory,1638 остальных/all dependency maps прежние.1493 AST меняется только добавлением imageUri в projection; query/API/send/history/RLS не меняются. Для отсутствующего/битого фото прежний Media fallback.

Публикация exact commit/Pages/HTTPS/live отдельно в design/message-covers-fix-20261018/PUBLICATION.json. Исходные1749022/hashed bundle сохраняются. Новых фото/событий/переписок/записей в БД не добавляется, внутрь чатов при проверке не заходим. Полная server/privacy/consent/native приёмка отдельно.
