# Основной экран «Я» — production r5

UI-ME-20261018,18.10.2026. После коммита принятого локального r5 пользователь прямо поручил публикацию: «давай на сайт». Исходники r5 сохранены05aaf2d; production опирается на действующий bundle выпускаf712e1b, а не на старый runtime локального preview.

## Версия и область

Target https://gomeet-organizers.ru/profile, гостевой режим. Runtime base **f712e1b4c5f42803073aa4e628b375d4f8b7df34**, bundle74aa975c6472a6cdadd6b710c9d79366 / SHA256a1b6fdaeea0efd69aa01be6cf157ae362ec2319e9ea087c888eb7b690d4edb66. Git parent05aaf2d содержит только архив локального концепта, production entries ещё прежние.

1529 получает принятый MeLayout r5 с теми же styles/шрифтами, реальными входами. Исходные hooks, guest/org projections, featured/pinned selection, ProfileTabs/ProfileEvent и исходный organizer return AST-identical. Новая компоновка применяется только guest, режим организатора сохраняет прежний UI до отдельной работы D-048. Общий parent1494/настройки, read-save1602/auth/mode/backend/RLS/URLs/остальные1638 factories/dependency maps не меняются.

В1601 добавлен один entry: `route.params.openPinnedBadges` открывает существующий picker один раз после успешной гидрации и снятия прежнего blocked. При loading/error/unknown/account switch прежний guard сохраняется; автоматического Save нет. AST проверка подтверждает, что после удаления route parameter/ref/effect код редактора полностью прежний. Данные/предел3/null-vs-empty/real save/upload/validation не перепроектированы.

## Рабочие действия

- Редактирование по аватару → опубликованный EditProfile. Шестерёнка → существующий callback parent1494 и опубликованные настройки. Убранные по D-062 отдельная edit-кнопка/«Мой профиль»/колокольчик не возвращаются.
- Значки под именем и карточка «Достижения» → существующий Trophies с audience guest. «На профиле» → EditProfile с openPinnedBadges=true, существующий выбор наград. «Промокоды» → RewardWallet.
- Посетил → вкладка Прошедшие, прежние реальные event hooks; current/saved/past tabs и eventId navigation сохранены. Подписчики/подписки — прежние агрегаты без открытия чужих списков.
- Нет local notices, placeholder collection/pin slots/фиктивного прогресса или нового artwork в активном UI. Новый дизайн/механика достижений остаются отдельному чату D-038/066/073. Существующие legacy Trophies/RewardWallet содержимое, включая прежние legacy streaks, не переделываются этим выпуском; D-032 для новой версии системы и уведомлений сохраняет собственную область и не закрывается автоматически.

Архив локального r5 из05aaf2d сохраняется как maintenance-source/preview, не активируется вместо production bundle. Его старые BUILD/CHECK/NOT RUN являются историей. RELEASE-BUILD/TEST/EDITOR-ENTRY-TEST/CHECK/INSTALL описывают новый production пакет; финальная публикация фиксируется отдельно в design/me-concept-20261018/r5/PUBLICATION.json.

## Baseline и критерии

| ID / тип | Условие/версия | Критерий и evidence | Статус |
|---|---|---|---|
| GOV-001/002, RT-001 DEC | Весь пакет organizers f712→r5 | Source/base/архив/implementation/tests/publication разделены, hashes/BUILD/TEST/Pages/live | Публикация отдельно от локального коммита05aaf2d |
| PD-04/05, RT-005 DOC | Owner profile, aggregates, selected awards; переданные документы не утверждены автоматически | Сохранить projection/audience/pins, не добавлять публичные follower lists/consents/видимость | Frontend scope без изменения выдачи; server viewer/RPC/RLS/consent acceptance NOT RUN, LGL-004/008 отдельно |
| RT-003 OPEN | Фото профиля | Прежний Hero/fallback сохраняется, обязательность/цели не вводятся | Artwork/photo model не пересогласовывается |
| RT-011 PROP | Entry в редактор после чтения | Показ picker только после старого readReady/hydrated/blocked, отсутствие auto-save, read failure guard прежний |25 isolated editor tests, real Save/upload/fault injection не выполняются |
| D-038/048/064/065 DEC | Граница достижений/режима/шрифтов | Шрифты r5 и только входы в достижения; organizer return и отложенные detail экраны прежние | Source/style AST + GUI; новые достижения отдельно |

Источники: product/LEGAL-BASELINE.md и business/legal-baseline-2026-10-15/LEGAL-ANALYSIS.md#pd-04/#rt-005; текущий product/TASKS UI-ME; immutable design/me-concept-20261018/r5/COMMIT.json. PAY/ORG/enrollment/document/account mutations не добавляются; их compliance не заявляется.

## Проверки

10 isolated Me checks: header/pins, edit/settings, Trophies/Wallet/pin entry, stats/tabs/events/error/empty.25 isolated editor checks: прежние23 read/save/upload/identity invariants плюс deferred entry после успешного чтения/однократность без авто-Save. Browser: actual owner data, настройки/Back, picker/Done/Back без выбора/Save, Trophies/Wallet/Back, tabs,320/390/fonts. Browser no actual profile writes, reward application/checkout/account mutations. Actual RPC failure injection/server privacy/RLS/consent/native/physical handset NOT RUN.

После установки проверить exact Pages commit, HTTPS hash всех файлов выпуска и live profile/reload/настройки/entry/320–390. Старыеf712e1b/bundle сохранить для отката. Канонические app/web/site-main и файлы отдельного чата достижений не меняются.
