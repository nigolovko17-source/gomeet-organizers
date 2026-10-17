# Локальный концепт «Я» r5

Открыть: http://127.0.0.1:43200/maintenance/me-20261018/index.html

MeLayout.jsx — редактируемый новый слой UI; MeProfileScreen.jsx генерируется с исходными hooks/экспортами. build.cjs создаёт только локальные concept.js/preview.html.
OriginalProfile.js — читаемая reference-копия factory1529 выпуска5dea922, не канонический исходник приложения.
SPEC.md/BUILD.json фиксируют происхождение и scope; CHECK.json и PNG в design — фактическая проверка.
Не устанавливать concept.js в production: он содержит локальные заглушки и notices. Публикация требует отдельного поручения и адаптации.

Production r5 подготовлен по новому прямому поручению пользователя: MeLayout.production.jsx/MeProfile.production.jsx, EditProfile.entry.production.jsx и build-release.cjs + ACCEPTED-STYLE.json. Реальные callbacks восстановлены; RELEASE-SPEC/BUILD/TEST/EDITOR-ENTRY-TEST/CHECK/INSTALL описывают выпуск. Новая компоновка — guest, прежний organizer UI сохранён; достижения открывают существующие Trophies/Wallet/picker до завершения отдельного дизайна. Финальный publication receipt хранится отдельно в design/me-concept-20261018/r5/PUBLICATION.json; PENDING в pre-publish receipts исторический.
