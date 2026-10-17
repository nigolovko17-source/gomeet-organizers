# Profile settings — production r2

Принятые настройки из шестерёнки профиля. SettingsPanel.production.jsx содержит UI, ProfileSettings.production.jsx — итоговый1494; build-release.cjs + ACCEPTED-STYLE.json воспроизводят bundle из сохранённой основыecda6a9. RELEASE-SPEC.md определяет среду/маршруты/границы, RELEASE-BUILD/TEST/CHECK/INSTALL — квитанции сборки и проверки до публикации.

Новый entry «Стать организатором» ведёт в прежний Verification, переключение подключённого профиля использует старый setMode. Реальные routes/clipboard/QR восстановлены. Backend/права/акцепт/билеты/поддержка и сама вкладка Me этим выпуском не переделываются. Локальные reviewer/fixtures/preview/source snapshots отдельно и не активируются в production.

Финальная Pages/HTTPS/live квитанция хранится в design/profile-settings-concept-20261018/r2/PUBLICATION.json после выпуска; PENDING в pre-publish receipts является историческим состоянием.
