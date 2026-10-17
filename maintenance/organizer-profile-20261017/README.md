# Публичный профиль организатора — r4

## Поручение на публикацию

17.10.2026 пользователь принял текущий r4 и прямо поручил опубликовать страницу организатора на gomeet-organizers.ru. Выпускается тот же candidate SHA51bef1daaa843d761b8ea5a2a3a6facb66309d15a18f63bb1478a63437bea9d6 с настоящими follow/report/clipboard callbacks, без локальных имитаций. RELEASE-CHECK.json закрепляет финальный asset и исключённые preview-файлы. Результат выпуска записывается отдельно в design/organizer-profile-concept-20261017/r4/PUBLICATION.json; прежние NOT RUN ниже — история локальной работы. Сохранён d6d2f06 для отката.

По умолчанию build.cjs генерирует candidate.js; в публикацию входит его hashed копия из _expo/static/js/web, а local candidate.js/concept.js/viewer/preview.html и отклонённые компоненты r1 не входят. Preview build читает script entry по шаблону текущего asset, чтобы последующий локальный просмотр продолжал использовать демонстрационные callbacks. Share QR и скопированная ссылка используют прежний organizerProfileLink с текущим origin; на целевом HTTPS это gomeet-organizers.ru. Автоматической отправки нет, остальные экраны и данные не меняются.

## Текущее уточнение r4

Пользователь принял вариант с «Поделиться» и поручил убрать дублирующие пункты из «…», затем удалить подпись «Покажите QR-код или отправьте ссылку». В r4 из меню удалены «Скопировать ссылку» и «Открыть QR-код»; остались уведомления и жалоба. В Share-sheet сохранены QR, имя и копирование без поясняющей подписи. Только UI1623, прочие1639 factories и все deps прежние. [r4/CHECK](../../../../design/organizer-profile-concept-20261017/r4/CHECK.json); r3 sources/QA сохранены. Baseline/среда и ограничения ниже прежние, серверные права не менялись. Без коммита и публикации, сайт d6d2f06.

## История r3

Пользователь отметил, что подписка r2 слишком растянута, и предложил заменить бывшую кнопку сообщений другим действием. Рабочее предложение агента — круглая «Поделиться профилем» между подпиской и меню. При390px подписка218×52, две круглые кнопки52×52, gaps10; исходные лучи/аватар/статистика/афиши сохранены. Это предложение пока не принято отдельно.

Кнопка открывает существующее окно QR-кода, переименованное в «Поделиться профилем», с добавленной кнопкой «Скопировать ссылку». Используются прежние organizerProfileLink и clipboard callback; автоматической отправки/адресатов/новых полей нет. Успех закрывает окно, ошибка отображается внутри. В preview копирование только показывает notice, не меняя clipboard; подписка и жалобы также демонстрационные. Camera scan и настоящее clipboard API этим локальным просмотром не квалифицируются. Кнопка сообщений/Chat по-прежнему отсутствуют, общая система переписки не меняется.

Канал/source/baseline и build команды ниже сохраняются. Только1623 изменён,1639 factories/все deps прежние; root/profile/404 не тронуты. R2 source snapshot сохранён в design/organizer-profile-concept-20261017/r2/source-snapshot. Текущие [r3](../../../../design/organizer-profile-concept-20261017/r3/README.md) и [CHECK](../../../../design/organizer-profile-concept-20261017/r3/CHECK.json) отделены от исторического r2. **Без коммита и публикации**, действующий сайт d6d2f06.

## История r2

UI-ORGANIZER-PROFILE-20261017.17.10.2026 пользователь отклонил новый layout r1 и выбрал прежний опубликованный вид с одной правкой: удалить кнопку сообщений и заполнить её место расширенной «Подписаться». Сохранены лучи, аватар128px, центрированное имя/ник/город/описание, прежняя карточка статистики и сетка2+1 афиш. Меню справа52px, gap10px, высота подписки52px; других UI-изменений нет.

[Локальный просмотр](http://127.0.0.1:43200/maintenance/organizer-profile-20261017/index.html). Реальные данные «Городского клуба»:0 проведённых,0 подписчиков,3 ближайших события. Кнопка и весь Chat callback удалены из исходника этого публичного экрана; общая система сообщений и другие входы не меняются. Layout r1 не применяется; его источники и свидетельства сохранены в design/organizer-profile-concept-20261017/r1/source-snapshot.

## Сборка / среда

База: organizers web d6d2f06861c306a28abb226b61e33f1e12f03239, bundle index-45de94030c2598305a570ed785268fa4.js, SHA cbbb4199e60cdc86cd63bf985fe204716c5b5de7c18a6da6a3af12c6aac24fd5. published-organizer.js — snapshot factory1623; OrganizerProfileScreen.js — читаемый исходник с удалённой кнопкой/переходом и изменённой шириной подписки/меню. Общие ProfileHero/ProfileTabs/ProfileEvent/Avatar не меняются.

`node maintenance/organizer-profile-20261017/build.cjs` строит candidate.js с настоящими исходными follow/menu callbacks и без Chat. `--preview` дополнительно строит concept.js/preview.html и обновляет локальный viewer: подписка только React state, копирование/жалоба — notice без отправки. Переключатель состояний и retry сохраняют прежнюю локальную демонстрацию. Другие страницы используют исходные callbacks; денежных действий работа не выполняет.

BUILD.json фиксирует candidate и preview раздельно. Только1623 изменён,1639 factories и все dependency maps byte-exact. Root/profile/404, основной app source и опубликованная версия не менялись. Новых commit/push/publication не выполнялось.

## Критерии / baseline

Источник product/LEGAL-BASELINE.md, design/LEGAL-TRACEABILITY.md;17.10.2026, local organizers web r2 поверх d6d2f06. GOV-001…003/RT-001 DEC: source/build/environment и local/live доказательства раздельно. PD-04/06/07/RT-005 DOC: прежние returned fields/hooks/видимость не расширяются, полная viewer/consent/RLS матрица NOT RUN. PD-08/09 DOC: удаление входа не квалифицирует серверный чат/акцепты. LAW-RU-016 conditional: нет выдуманных реквизитов/проверок, полнота seller disclosure отдельно. Новая система достижений и organizer onboarding не затрагиваются.

Приёмка этой дельты: исходные hero/stats/tabs/event layout сохранены,0 кнопок сообщений/Chat callback, подписка занимает остаток ряда при меню52px/gap10;360/390px без overflow, follow demo toggle, syntax/hash/module/diff PASS. Неизменённые state/flow проверки r1 не повторяются. Полная server/native/legal приёмка не заявлена. [r2/CHECK](../../../../design/organizer-profile-concept-20261017/r2/CHECK.json), [r2](../../../../design/organizer-profile-concept-20261017/r2/README.md).
