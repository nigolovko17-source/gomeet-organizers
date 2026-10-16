/** Same Metro factory as NotificationsScreen; React/Icon hooks come from that source. */
export function notificationAction(n: any) {
  if (!n || n.kind === 'streak') return null;
  const order = n.orderId;
  if ((n.kind === 'ticket' || n.kind === 'refund') && order)
    return { label: n.kind === 'ticket' ? 'Открыть билет' : 'Открыть заказ', screen: 'Ticket', params: { orderId: order } };
  if (n.threadId) return { label: 'Открыть обращение', screen: 'SupportThread',
    params: { threadId: n.threadId, ...(n.kind === 'support_due' ? { as: 'support' } : {}) } };
  if (n.kind === 'follow' && n.actorId)
    return { label: 'Открыть профиль', screen: 'UserProfile', params: { userId: n.actorId } };
  if (n.kind === 'badge') return { label: 'К моим наградам', screen: 'Tabs', params: { screen: 'Profile', params: { tab: 'ach' } } };
  if (n.eventId) return { label: 'Открыть событие', screen: 'EventDetail', params: { eventId: n.eventId } };
  if (n.kind === 'support' || n.kind === 'measure') return { label: 'Открыть поддержку', screen: 'Support', params: {} };
  return null;
}
export function notificationModel(n: any) {
  const d = n.detail || {}, meta = META[n.kind] || { label: 'Уведомление', icon: 'bell' };
  const action = notificationAction(n), pairs: [string,string][] = [];
  let title = n.title || meta.label, text = n.body || '', contextTitle = '', contextLabel = '', subtitle = '', note = '';
  if (n.kind === 'ticket') {
    title = 'Билет куплен';
    contextTitle = d.eventTitle || String(n.title || '').replace(/^Билет куплен:\s*/, '');
    contextLabel = 'Событие'; subtitle = d.eventWhen || ''; note = d.eventPlace || '';
    if (d.ticketName) pairs.push(['Билет', d.ticketName]);
    if (Number.isSafeInteger(d.quantity) && d.quantity > 0) pairs.push(['Количество', String(d.quantity)]);
    if (d.ticketName || d.eventWhen) text = 'Билет оформлен на событие «' + contextTitle + '». Подробности доступны на экране билета.';
  } else if (n.kind === 'badge') {
    contextLabel = 'Награда'; contextTitle = d.badgeName || String(n.title || '').replace(/^Ты получил бейдж\s*/, '').replace(/^«|»$/g, '');
    title = 'Новая награда';
    if (Number.isFinite(n.at)) pairs.push(['Получена', new Date(n.at).toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'long', year: 'numeric' })]);
  } else if (n.kind === 'follow') {
    title = 'Новый подписчик'; contextLabel = 'Профиль'; contextTitle = n.actorName || n.body || 'Подписчик';
    text = 'На тебя подписались.';
  } else {
    if (d.eventTitle) { contextLabel = 'Событие'; contextTitle = d.eventTitle; }
    else if (n.threadId) { contextLabel = 'Обращение'; contextTitle = d.threadNo ? 'Обращение № ' + d.threadNo : 'Обращение в поддержку'; }
    if (Number.isSafeInteger(d.quantity) && d.quantity > 0) pairs.push(['Количество', String(d.quantity)]);
    if (n.kind === 'refund' && Number.isSafeInteger(d.amount) && d.amount >= 0)
      pairs.push(['Сумма возврата', (d.amount / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })]);
  }
  const at = Number.isFinite(n.at) ? new Date(n.at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' МСК' : '';
  return { meta, title, text, contextTitle, contextLabel, subtitle, note, pairs, at, action };
}
function DetailVisual({ n, hero = false }: any) {
  const model = META[n.kind] || { icon: 'bell' };
  const avatar = n.kind === 'follow' || n.kind === 'sale', award = n.kind === 'badge';
  const url = avatar ? n.avatarUrl : award ? n.awardLogoUrl : null;
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  return <span className={'nd-symbol' + (avatar ? ' nd-avatar' : award ? ' nd-award' : '') + (hero ? ' nd-hero' : '')} aria-hidden="true">
    {url && !failed ? <img src={url} alt="" onError={() => setFailed(true)} />
      : avatar ? (n.actorName?.trim().slice(0,1).toUpperCase() || '?')
      : award ? <span className="nd-award-slot"><Icon name="image" size={34} color="#aaa9a3" /></span>
      : <Icon name={model.icon} size={24} color="#b8b8b3" />}
  </span>;
}
export function NotificationDetail({ n, loading, error, reload, onBack, onAction, bottom = 0 }: any) {
  const heading = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [n?.id, loading, error]);
  if (!n) return <div className="nd-shell">
    <div className="nd-main nd-state">
      {loading ? <div className="nd-loading" role="status" aria-label="Загрузка уведомления"><span className="nd-sk nd-sk-icon" /><span className="nd-sk nd-sk-title" /><span className="nd-sk nd-sk-body" /><span className="nd-sk nd-sk-context" /></div>
        : <><span className="nd-symbol"><Icon name={error ? 'x' : 'bell'} size={28} color="#b8b8b3" /></span>
          <h1 ref={heading} tabIndex={-1}>{error ? 'Не удалось загрузить' : 'Уведомление недоступно'}</h1>
          <p>{error ? 'Попробуй ещё раз.' : 'Подробности больше не доступны. Другие уведомления можно посмотреть в списке.'}</p>
          <button className="nd-primary" onClick={error ? reload : onBack}>{error ? 'Повторить' : 'К уведомлениям'}</button></>}
    </div>
  </div>;
  const m = notificationModel(n), hero = n.kind === 'badge' || n.kind === 'follow' || n.kind === 'sale';
  return <div className="nd-shell" data-notification-detail={n.kind}>
    <div className="nd-main"><article>
      <div className="nd-meta">{!hero && <DetailVisual n={n} />}<div><span className="nd-category">{m.meta.label}</span><time className="nd-date">{m.at}</time></div></div>
      {m.meta.audience && <span className="nd-audience">{m.meta.audience}</span>}
      {hero && <DetailVisual n={n} hero />}
      <h1 ref={heading} tabIndex={-1}>{m.title}</h1>
      {!!m.text && <div className="nd-message">{m.text.split(/\n\n+/).map((p: string,i: number) => <p key={i}>{p}</p>)}</div>}
      {m.contextTitle && <section aria-label={m.contextLabel}>
        <h2 className="nd-context-label">{m.contextLabel}</h2>
        <div className="nd-context"><div className="nd-context-summary"><h2>{m.contextTitle}</h2>{m.subtitle && <span>{m.subtitle}</span>}{m.note && <span>{m.note}</span>}</div>
          {m.pairs.length > 0 && <dl>{m.pairs.map(([k,v]) => <div className="nd-pair" key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
        </div>
      </section>}
      {n.kind === 'refund' && <p className="nd-footnote">Актуальный статус возврата и билета — в заказе.</p>}
      {!m.action && <p className="nd-footnote">Ссылка на связанный объект недоступна.</p>}
    </article></div>
    <div className="nd-action-bar" style={{ paddingBottom: Math.max(24, bottom) }}>
      <button className="nd-primary" onClick={() => m.action ? onAction(m.action) : onBack()}>{m.action?.label || 'К уведомлениям'}</button>
    </div>
  </div>;
}
