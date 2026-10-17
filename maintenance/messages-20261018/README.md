# Страница сообщений — принятый r2

UI-MESSAGES-20261018. По D-055: сохранить шапку/поиск, убрать Все/Личные/События, добавить тонкие разделители и убрать синюю рамку поля. По D-056 пользователь поручил отдельную публикацию этого варианта на gomeet-organizers.ru.

Исходники: MessagesScreen.jsx (принятый local r2), MessagesScreen.production.js (без preview), build-release.cjs. RELEASE-SPEC-r2.md закрепляет scope/основания/унаследованные ограничения; RELEASE-BUILD.json — hash/scope, RELEASE-CHECK.json — локальную production проверку. Итог exact commit/Pages/HTTPS/live отдельно в design/messages-concept-20261018/r2/PUBLICATION.json.

Локальный reviewer: http://127.0.0.1:43200/maintenance/messages-20261018/index.html . Пересборка preview: node maintenance/messages-20261018/build.cjs . Production candidate: node maintenance/messages-20261018/build-release.cjs .

Runtime меняет только1487 factory/deps;1639 остальных неизменны. Сохранены Chat1579/data1493/auth/searchPeople; restored Chat/follow callbacks. Force states/вымышленные примеры/перехваты не включены в активную сборку. Отдельный UI чата/сервер/privacy/consent/native не изменялись и не заявлены проверенными. Исходные error/avatar/name-search ограничения перечислены в release passport; LGL-004/008 остаются отдельными.

Исторические концепты r1/r2, BUILD/CHECK и LOCAL-SPEC-r2.md сохраняют локальные статусы до поручения D-056. Сборочный базовый f62a241 и старый hashed bundle сохраняются для отката.
