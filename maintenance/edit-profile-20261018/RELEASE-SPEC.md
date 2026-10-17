# UI-EDIT-PROFILE-20261018 — production r1

Поручение18.10.2026: «Отлично, давай опубликуем этот вариант редактирования профиля на сайте».
Target https://gomeet-organizers.ru/EditProfile ; Pages main/root.
Base5dea922163d9d006103f5404a0209d1f4fa15b1a / bundle17699c7e… SHA256695e9ef6….
Этот выпуск относится к EditProfile. Локальный Me r5 и система достижений отдельного чата не публикуются этим поручением.

## Принятый дизайн и рабочие действия

ACCEPTED-STYLE/RELEASE-BUILD проверяют AST-identical styles и Field/FormInput из принятого r1. Murs Gothic/Onest, фото, поля, счётчик160 и fixed Save сохранены.
Preview flags/forced states/notices/postMessage/local fake Save исключены из production.
Подключены прежние pickAvatar/uploadAvatar/saveMyProfile, useGoBack и toast; для прямого URL без history Back возвращает в Tabs/Profile; save helper и backend payload validation AST-identical base1602. Сохраняются userId/mode/name/username/avatar/bio/pinned/interests; source normalizeUsername/USERNAME_RULE прежние.
За компактным входом наград — существующие CheckRow выбора, automatic=null/hidden=[], максимум3 без новых правил/графики. Это сохранение прежней возможности, до интеграции нового раздела достижений.
Параллельное сохранение/выбор фото блокируются. Поля и footer блокируются в ожидании. Ошибки сохранения сохраняют ввод; duplicate nickname показывается у поля. Смена аккаунта/режима/размонтирование не применяют старые async completion к новому экрану.

## Защита чтения

1602 useEditableProfile различает loading/failed/ready и возвращает reload; success snapshot привязан к userId/mode. Результат старого запроса игнорируется после cleanup. RPC error/rejection/service unavailable не считаются успешно загруженным empty profile. Успешный null-row остаётся исходным empty профилем.
1601 разрешает Save только после успешного чтения, гидратации той же identity и загрузки интересов. Ошибка чтения показывает Retry и отключает Save. После upload повторно проверяется текущая identity до записи; p_expected_user в прежнем save RPC сохраняется.
UI-EDIT-PROFILE-READ-20261018 реализуется в этом exact organizers web target; исправление не переносится автоматически на app/web/v62 и не закрывает все LGL-003/004.

## Scope

Changed factories1033/1601/1602; dependency map только1601 (+430 Input,1422 Feather,1023 Sheet,142 navigation).
1033 добавляет один direct EditProfile mapping; остальные routes/prefixes AST прежние.1637 других factories/все остальные deps unchanged. Me1529/Chat1579/Messages1487/1493 и прочие экраны неизменны.
Схема БД, RLS, auth/consent, RPC implementation, Storage helper и шрифтовые assets не менялись. Source frontend публикуется здесь в maintenance; canonical app/web/site/main dirty рабочие деревья не редактировались.

## Проверки и ограничения

RELEASE-TEST:23 isolated React checks с read/save/photo stubs — error/retry/rejection, no-save-before-ready, stale reads/account/mode switch, duplicate-submit, full payload, error preservation, photo cancel/upload failure/success, original badge picker states/limit.
Все тестовые имена/запросы остаются в локальном check-release.cjs; fixture/source reviewer не входят в активный bundle/публикуемый набор.
RELEASE-CHECK/PNG: production bundle в браузере, normal actual profile RPC read, fonts/layout320/390, original award picker, Back и direct/reload. Реальные изменения профиля, файловая загрузка и реальные save/unique conflict RPC в QA не выполняются.
Методы чтения/сохранения сверены с текущими официальными Supabase rpc docs; changelog прочитан. API shape/dependencies не обновляются. Старый TLS deprecation не является изменением данного frontend.

## Юридические ID

GOV-001/002/RT-001 — DEC: source/base/candidate/environment/build/test/publication различаются.
PD-04/RT-005 — DOC переданных проектов (утверждение/акцепт не установлены): UI не добавляет новые права/видимость и не считается owner/other/anon/RLS/consent приёмкой. LGL-004/008 остаются.
RT-003 — OPEN: исходный Avatar fallback без фото сохранён, обязательность/цели фото не пересогласованы.
RT-011 — PROP: конкретная frontend защита чтения реализована/изолированно проверена в этом target; реальный RPC fault injection/native/v62 не заявляются.
RT-012 — PROP: исходные upload/retention/cleanup/server timeout контракты прежние. Фото не отправляется до Save; orphan cleanup после server save failure не внедрялся и не закрыт.
[Baseline](../../../../product/LEGAL-BASELINE.md), [PD-04/RT-011/012 sources](../../../../business/legal-baseline-2026-10-15/LEGAL-ANALYSIS.md).
Наличие макета/галочки не объявляется серверным контролем; LAW/DOC/PROP не смешиваются.

## Публикация

INSTALL/PUBLICATION/HTTPS-CHECK фиксируют активированный hash, commit, Pages exact build и live UI. Base5dea922/старый bundle сохраняются для отката. До этих свидетельств — PENDING.
