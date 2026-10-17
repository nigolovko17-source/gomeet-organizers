# Профиль другого пользователя — принятый r2, выпуск

UI-USER-PROFILE-20261018.18.10.2026 пользователь принял локальный r2 и прямо поручил публикацию на gomeet-organizers.ru. Принятые действия по D-046: «Подписаться», «Написать», «…»; «Поделиться» только первым пунктом меню. Награды остаются в отдельном направлении D-038.

## Версия и воспроизведение

Target: organizers web, UserProfile `/people/:userId`. База3c7ab34ddaf74178a19545e493aca055ace9c38e, asset a5dce012…/SHA2565523ad4d…. Принятый JSX SHA2560ca762ea…; локальный bundle SHA256a4c7fd82…. `BUILD.json`/`CHECK.json` — исторические свидетельства preview, не опубликованного runtime.

`UserProfileScreen.jsx` — неизменённый принятый r2; `published-user-profile.js` — исходный factory1584. `node maintenance/user-profile-20261018/build.cjs` воспроизводит preview. `node maintenance/user-profile-20261018/build-release.cjs` удаляет preview-сценарии/notice/local-follow и строит production factory/candidate; `UserProfileScreen.production.js` — читаемый результат, `RELEASE-BUILD.json` — точные хеши/границы. Для сборки использованы уже установленные Babel зависимости app; исходники app/web/site/main не менялись.

Только1584 и его dependency map изменены. Добавлены существующие1422 Feather,1495 QR,1541 ReportSheet,1325 blockUser. Остальные1639 factories/deps, в том числе ProfileHero, публичная проекция1585, Chat, follow/backend, ранее опубликованные экраны и награды прежние. Accepted profile/menu/Share JSX и все styles сверены AST hash и не менялись; demo safety explanation заменён реальными существующими действиями.

## Реальные действия

Подписка использует прежние follow/unfollow и обновление query cache. «Написать» открывает прежний Chat с теми же dm/userId/name/initials. Share строит QR и копирует исходный userProfileLink, в браузере это текущий origin + `/people/:id`; новый адрес/источник персональных данных не вводится. Жалоба открывает существующий ReportSheet1541 с profile/userId. Блокировка требует отдельного подтверждения и вызывает существующий blockUser1325; текст последствий взят из существующего ReportSheet, глобальный компонент/сервер не изменены. Это рабочая реализация принятого меню, а не новое продуктовое решение о правилах модерации. Ошибка блокировки имеет отдельное состояние; «Отмена» не выполняет запись.

## Применимость и проверка

Источники/полный локальный паспорт: [LOCAL-SPEC-r2](LOCAL-SPEC-r2.md), [LEGAL-BASELINE](../../../../product/LEGAL-BASELINE.md), [дизайн-матрица](../../../../design/LEGAL-TRACEABILITY.md).

- GOV-001/002, RT-001 — DEC: source/build/environment и раздельные реализация/проверка/публикация. Evidence: RELEASE-BUILD/RELEASE-CHECK и design/r2/PUBLICATION/HTTPS-CHECK.
- PD-04/06, RT-005 — DOC, утверждение/согласия не установлены: только исходный public DTO; private поля/контакты/история и дополнительные полномочия не добавлены. Ошибка/недоступность/нет входа сохраняют исходные границы. RPC1585 byte-exact; server/RLS/consent acceptance NOT RUN.
- PD-05 — DOC: агрегаты остаются некликабельными, чужие списки/история не открываются.
- PD-08/09 — DOC: кнопка Chat и интерфейс подтверждения/жалобы не доказывают серверный допуск, согласия или исполнение модерации. Существующие APIs/правила неизменны; отправка сообщений/жалоб/блокировка в QA не выполнялись.

Фактическая локальная проверка — RELEASE-CHECK.json; принятые r1/r2 и их CHECK/PNG сохранены отдельно. Публикационное свидетельство и live PNG сохраняются в design/user-profile-concept-20261018/r2. Реальные follow/report/block/send, физический телефон/native и полная privacy/legal приёмка не заявлены. Финансы, документы/акцепт, граф/контакты и права доступа не изменялись.
