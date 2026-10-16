/** Published organizers notification list. Uses existing data/read/navigation contracts. */
import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from './ScreenHeader';
import { Icon } from './Icon';
import { useNotifications, markServerNotificationsRead } from './notifications';
import { getNotifSeen, markNotifSeen } from './notifStore';
import { useGoBack } from './useGoBack';
import { columnContent, useLayout } from './layout';

const META: Record<string, { label: string; icon: string; audience?: string }> = {
  ticket: { label: 'Билет куплен', icon: 'ticket' },
  refund: { label: 'Возврат', icon: 'wallet' },
  follow: { label: 'Подписка', icon: 'users' },
  support: { label: 'Поддержка', icon: 'msg' },
  measure: { label: 'Решение по аккаунту', icon: 'x' },
  badge: { label: 'Награда', icon: 'image' },
  sale: { label: 'Продажа билетов', icon: 'wallet', audience: 'Организатору' },
  review: { label: 'Проверка события', icon: 'check', audience: 'Организатору' },
  referral: { label: 'Претензия', icon: 'msg', audience: 'Организатору' },
  support_due: { label: 'Срок ответа', icon: 'msg', audience: 'Служебное' },
};
export default function NotificationsScreen({ navigation }: any) {
  const { tight } = useLayout();
  const insets = useSafeAreaInsets();
  const goBack = useGoBack();
  const { items: rawItems } = useNotifications();
  const items = useMemo(() => rawItems.filter((n: any) => n.kind !== 'streak'), [rawItems]);
  const [seenBefore, setSeenBefore] = useState<number | null>(null);
  useEffect(() => { getNotifSeen().then(setSeenBefore); }, []);
  useEffect(() => { if (items.length) markNotifSeen(items[0].at); }, [items]);
  useEffect(() => { markServerNotificationsRead(); }, []);
  const groups = useMemo(() => groupItems(items, seenBefore), [items, seenBefore]);
  function open(n: any) {
    if (n.kind === 'refund' && n.orderId) navigation.navigate('Ticket', { orderId: n.orderId });
    else if (n.threadId) navigation.navigate('SupportThread', { threadId: n.threadId });
    else if (n.eventId) navigation.navigate('EventDetail', { eventId: n.eventId });
    else if (n.kind === 'follow') navigation.navigate('People');
    else if (n.badgeId) navigation.navigate('Tabs', { screen: 'Profile', params: { tab: 'ach' } });
    else navigation.navigate('Tabs', { screen: 'Home' });
  }
  return <View style={[styles.screen, { paddingTop: insets.top }]}>
    <style>{notificationCSS}</style>
    <View style={columnContent}><ScreenHeader design="2026" title="Уведомления" onBack={goBack} /></View>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[columnContent, styles.list, { paddingHorizontal: tight ? 16 : 24, paddingBottom: 32 + insets.bottom }]}>
      {items.length ? <div className="nn-feed">
        {groups.map(group => <section className={'nn-group ' + (group.fresh ? 'nn-fresh' : '')} key={group.key}>
          <div className="nn-group-label"><h2>{group.label}</h2>
            {group.fresh && <span className="nn-count" aria-label={'Новых уведомлений: ' + group.items.length}>{group.items.length}</span>}
          </div>
          <div className="nn-stack">{group.items.map((n: any) => <NotificationRow key={n.id} n={n} fresh={group.fresh} onOpen={() => open(n)} />)}</div>
        </section>)}
      </div> : <div className="nn-empty"><span className="nn-empty-icon"><Icon name="bell" size={32} color="#b8b8b3" /></span>
        <h2>Пока тихо</h2><p>Здесь появятся билеты, награды, новые подписчики и ответы поддержки.</p></div>}
    </ScrollView>
  </View>;
}
export function groupItems(items: any[], seenBefore: number | null) {
  const groups: any[] = [];
  const lookup = new Map<string, any>();
  for (const n of items) {
    if (n.kind === 'streak') continue;
    const fresh = seenBefore !== null && n.at > seenBefore;
    const date = new Date(n.at);
    const valid = Number.isFinite(date.getTime());
    const key = fresh ? 'fresh' : valid ? [date.getFullYear(), date.getMonth(), date.getDate()].join('-') : 'unknown';
    let group = lookup.get(key);
    if (!group) {
      group = { key, fresh, label: fresh ? 'Новые' : valid ? date.toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', ...(date.getFullYear() === new Date().getFullYear() ? {} : { year: 'numeric' })
      }) : 'Ранее', items: [] };
      groups.push(group); lookup.set(key, group);
    }
    group.items.push(n);
  }
  return groups;
}
function NotificationRow({ n, fresh, onOpen }: any) {
  const meta = META[n.kind] || { label: 'Уведомление', icon: 'bell' };
  const title = n.kind === 'ticket' ? n.title.replace(/^Билет куплен:\s*/, '')
    : n.kind === 'badge' ? n.title.replace(/^Ты получил бейдж\s*/, 'Бейдж ') : n.title;
  return <button className="nn-row" data-notification-kind={n.kind} onClick={onOpen}
    aria-label={[fresh ? 'Новое уведомление' : '', meta.audience, n.title, n.body, ago(n.at)].filter(Boolean).join('. ')}>
    <NotificationVisual n={n} icon={meta.icon} fresh={fresh} />
    <span className="nn-body"><span className="nn-kind-line"><span className="nn-kind">{meta.label}</span>
      {fresh ? <span className="nn-time">{ago(n.at)}</span> : meta.audience && <span className="nn-audience">{meta.audience}</span>}</span>
      <span className="nn-title">{title}</span>{!!n.body && <span className="nn-message">{n.body}</span>}
    </span>
    <span className="nn-arrow" aria-hidden="true"><Icon name="right" size={16} color="#83837d" /></span>
  </button>;
}
function NotificationVisual({ n, icon, fresh }: any) {
  const avatar = n.kind === 'follow' || n.kind === 'sale';
  const url = avatar ? n.avatarUrl : n.kind === 'badge' ? n.awardLogoUrl : null;
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [url]);
  if (avatar) return <span className="nn-mark nn-avatar" aria-hidden="true">
    {url && !failed ? <img src={url} alt="" loading="lazy" onError={() => setFailed(true)} /> : (n.actorName?.trim().slice(0, 1).toUpperCase() || '?')}
  </span>;
  if (n.kind === 'badge') return <span className="nn-mark nn-award" aria-hidden="true">
    {url && !failed ? <img src={url} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span className="nn-award-slot"><Icon name="image" size={20} color="#aaa9a3" /></span>}
  </span>;
  return <span className="nn-mark" aria-hidden="true"><Icon name={icon} size={20} color={fresh ? "#141414" : "#b8b8b3"} /></span>;
}
function ago(at: number) {
  if (!Number.isFinite(at)) return '';
  const minutes = Math.floor((Date.now() - at) / 60000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return minutes + ' мин назад';
  if (minutes < 1440) return Math.floor(minutes / 60) + ' ч назад';
  return new Date(at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#0a0a0a' }, list: { paddingTop: 8 } });
const notificationCSS = `
.nn-feed{display:flex;flex-direction:column;gap:28px;width:100%;font:14px/21px Onest_400Regular,sans-serif;color:#f4f0e8}
.nn-feed *,.nn-empty *{box-sizing:border-box}.nn-group-label{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;color:#aaa9a3;font-size:12px;line-height:18px}
.nn-group-label h2{font:inherit;margin:0}.nn-fresh .nn-group-label h2{font-family:Onest_600SemiBold,sans-serif;color:#f4f0e8}.nn-count{padding:0 6px;min-width:20px;line-height:20px;text-align:center;border:1px solid #777772;border-radius:5px;font-size:11px;color:#f4f0e8}
.nn-stack{overflow:hidden;border:1px solid #2b2b2b;border-radius:18px;background:#141414}.nn-row{box-sizing:border-box;position:relative;display:flex;align-items:flex-start;gap:12px;width:100%;padding:16px;color:#f4f0e8;text-align:left;border:0;background:transparent;font:14px/21px Onest_400Regular,sans-serif;cursor:pointer;transition:background-color 150ms ease}
.nn-row+.nn-row{border-top:1px solid #2b2b2b}.nn-row:hover{background:#1c1c1c}.nn-row:focus-visible{outline:2px solid #f4f0e8;outline-offset:-4px}.nn-row:active{filter:brightness(.94)}
.nn-mark{display:grid;place-items:center;flex:0 0 40px;width:40px;height:40px;border:1px solid #393939;border-radius:12px;color:#b8b8b3;background:#191919}.nn-mark svg{width:22px;height:22px}
.nn-body{min-width:0;flex:1}.nn-kind-line{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 4px}.nn-kind{font-size:11px;line-height:16px;color:#b8b8b3;letter-spacing:.35px}.nn-time{font-size:11px;line-height:16px;color:#b8b8b3;white-space:nowrap}
.nn-title{display:block;font:15px/22px Onest_600SemiBold,sans-serif;overflow-wrap:anywhere}.nn-message{display:block;margin-top:5px;color:#b8b8b3;font-size:13px;line-height:20px;overflow-wrap:anywhere}
.nn-arrow{flex:0 0 14px;width:14px;height:14px;margin-top:23px}.nn-arrow svg{width:14px;height:14px}.nn-audience{color:#b8b8b3;font-size:10px;line-height:16px;padding:0 5px;border:1px solid #4a4a47;border-radius:4px;white-space:nowrap}
.nn-fresh .nn-stack{border-color:#777772;background:#1c1c1a}.nn-fresh .nn-row:before{position:absolute;content:'';left:0;top:18px;bottom:18px;width:2px;background:#f4f0e8;border-radius:0 2px 2px 0}.nn-fresh .nn-mark{border-color:#f4f0e8;background:#f4f0e8;color:#141414}.nn-fresh .nn-kind{color:#f4f0e8}.nn-fresh .nn-row:hover{background:#242421}
.nn-avatar{overflow:hidden;border-radius:50%;font:18px/24px Onest_600SemiBold,sans-serif}.nn-avatar img{width:100%;height:100%;object-fit:cover;border-radius:inherit}
.nn-mark.nn-award{border:0;border-radius:0;background:transparent}.nn-award img{width:100%;height:100%;object-fit:contain}.nn-award-slot{display:grid;place-items:center;width:36px;height:36px;border:1px dashed #65655f;border-radius:8px}
.nn-empty{min-height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 20px;gap:12px;color:#f4f0e8}.nn-empty-icon{display:grid;place-items:center;width:72px;height:72px;margin-bottom:8px;border:1px solid #393939;border-radius:24px;background:#141414}
.nn-empty h2{font:22px/29px MursGothic_WideDark,sans-serif;margin:0}.nn-empty p{font:14px/22px Onest_400Regular,sans-serif;max-width:300px;color:#aaa9a3;margin:0}
@media(max-width:420px){.nn-row{padding:14px;gap:10px}.nn-mark{flex-basis:36px;width:36px;height:36px}.nn-award-slot{width:32px;height:32px}}
@media(prefers-reduced-motion:reduce){.nn-row{transition:none}}
`;
