# Выпуск кода оформления чатов — r2,18.10.2026

UI-DM-20261018 / D-059. Пользователь поручил опубликовать варианты оформления личного/event чатов, отдельно запретив публикацию самих примеров переписок и их подстановку/загрузку ради демонстрации. Разрешение относится к frontend-коду на gomeet-organizers.ru поверх8ba4fb4; история в БД не создаётся и не меняется. Реальные переписки для live-показа не открываем.

## Точная область и данные

Принятый r2/D-058: компактная шапка/аватар, свои/входящие, день/автор/время, system/объявление организатора, многострочное поле, в пустом состоянии «Здесь появится ваш разговор.». Сохраняются header/composer/styles (AST hash в RELEASE-BUILD). Только1579 factory/deps;1639 остальных, Messages1487 и data1493 byte-exact.

Из production исключены личный/event sample arrays, их имена/тексты/IDs, forced preview states, postMessage и локальная подстановка. Fixture-bearing ChatScreen.jsx/build.cjs, reviewer/preview/concept.js и все browser QA stubs остаются локально, не входят в public commit. В public source только ChatScreen.production.js, безопасные provenance/receipts/release builder и активный hashed bundle. Renderer/QA source находится в design/chat-concept-20261018/r2, без публикации примеров.

Действующие useChatMessages/useDmMessages и ReportSheet payload прежние. Send/retry вызывает тот же hook; ref исключает двойной параллельный вызов, ошибки сохраняют каждый текст отдельно до повтора, rejected promise разблокирует ввод, key комнаты изолирует draft/failures. Отправка/повтор проверены через транспортные заглушки, реальные сервисные операции не выполнялись. Из серверного error сохраняется причина, не подменяется подтверждением доставки.

Исходный data1493 не отдаёт load/error/access state контракт. Поэтому отдельный loader/disabled UI сохранён как неактивный код шаблона, без фиктивных сигналов «онлайн»/доставки/прочтения и без новых серверных прав. Границы auth/доступа не расширяются. Локальные fixture состояния r1/r2 — исторический дизайн, не server acceptance.

## Основания и критерии

GOV-001/002, RT-001 DEC: source8ba4fb4/baseSHA61df28c1…, release/local/live различаются. Критерии: exact hash/scope; отсутствие fixture strings в1579; public stage не включает sample source; Pages exact commit/HTTPS bytes, без чтения реальных историй ради показа.

PD-04/05/RT-005 DOC: не расширять identity/graph/data projection. PD-08/09 DOC: утверждение/акцепт/применимость проекта условий не установлены, текущий код не считается доказательством взаимной связи/С-11/серверного допуска. Backend/RLS/consent не меняются и не засчитываются; LGL-004/008 сохраняются. D-048: ReportSheet/жалобы/блокировка/поддержка/финансовые экраны не переделываются.

RELEASE-TEST:11 изолированных React проверок пустой истории, whitespace, pending/ref guard, успеха, нескольких ошибок, повтора/исключения, route isolation, существующих типов renderer/back/ReportSheet; network0. Browser390/event и320/dm — только пустые шаблоны с1493 stub, без чтения/отправки историй; тот же production1579. Проверки физического handset/native/screen reader и server/RLS/consent NOT RUN.

## Публикация

Новый content-hashed bundle и profile/index.html/404.html/root cache marker, прежний8ba4fb4/bundle остаются. Один явный stage/commit; исходники с примерами не публикуются. После push: exact Pages build, HTTPS hashes новых файлов, активный runtime на Home без открытия chat history. По просьбе пользователя live-populated-чат не проверяется и не показывается; эта граница явно остаётся в PUBLICATION.json. До этих свидетельств публикация PENDING.
