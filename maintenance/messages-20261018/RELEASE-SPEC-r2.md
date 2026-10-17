# Выпуск страницы сообщений — r2, 18.10.2026

UI-MESSAGES-20261018, D-056: пользователь прямо поручил опубликовать принятый вариант страницы сообщений на gomeet-organizers.ru. Это разрешение на отдельный web-выпуск поверх f62a241, остальные режимы/экраны по D-030/048 отдельно.

## Что переносится

Принятый D-055: шапка/поиск r2, единый список без фильтров, тонкие1px разделители и отсутствие синей обводки при фокусе. Source hash зафиксирован в BUILD/RELEASE-BUILD. ChatRow/State/шапка/ScrollView/skeleton JSX и styles byte-equivalent после генерации AST. Только factory1487 и её три ссылки на уже существующие1320/1370/1400;1639 остальных factories/dependency maps byte-exact.

Preview-переменные, четыре вымышленных примера, postMessage и перехваты действий исключены. Восстановлены исходный Chat navigation payload и follow/unfollow callback; экран Chat1579, hooks1493, AuthGate/поиск/searchPeople/live/сортировка прежние. Реальных сообщений/подписок при проверках не отправлялось.

## Зафиксированные ограничения и решение области

Публикуется визуальный вариант с прежними hooks, без нового API-поведения. Исходные list hooks не отдают error, поэтому принудительный error/retry был только демонстрацией состояния и исключён; действующий loading/empty путь сохраняется. Избранный вариант личного аватара поддерживает avatarUrl, но исходный DM projection не передаёт URL в row — остаётся прежний initials fallback. Эти унаследованные ограничения не блокируют перенос принятой стилизации; изменение hook1493 и его контрактов не входит в данный выпуск.

GOV-001/002 и RT-001 DEC: источник/версия/среда/свидетельства локальной и live проверки отдельно. PD-04/05/08/09/10, RT-005 DOC: утверждение/акцепт/полная применимость не установлены. Критерий этого выпуска — отсутствие новых полей/контактов/онлайн/социального графа и прежняя граница AuthGate/search projection; полная server/privacy/consent приёмка NOT RUN. Унаследованное name/username расхождение PD-10 сохраняется как зависимость LGL-004/008; стилизация не подтверждает исполнение условия проекта документа. Источники: product/LEGAL-BASELINE.md, design/LEGAL-TRACEABILITY.md, LOCAL-SPEC-r2.md.

## Проверки и выпуск

RELEASE-CHECK: production candidate390/320 без overflow/автофокуса/синей рамки,9 строк/8 линий/0 табов; поиск/clear, открытие существующего event Chat и Back; source/scope/syntax PASS. Реальные message/follow/payment/delete и физический handset/native/server privacy не выполнялись.

Публикация: новый content-hashed bundle, переключить profile/index.html и404.html, обновить cache marker корневого redirect; исходный f62a241/bundle сохранить. Перед push сверить remote main, stage только файлы этого выпуска. После push: Pages built exact commit, HTTPS SHA256 новых activation/assets, live entry/direct/reload/search/clear/focus/Chat/Back/390px. Итог PUBLICATION/HTTPS-CHECK в design/messages-concept-20261018/r2, общий product context после проверки. До фактических свидетельств статус публикации PENDING.
