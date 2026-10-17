import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../constants/AuthProvider';
import { supabase, withTimeout } from '../lib/supabase';
import { fetchSocialProof } from '../data/socialProof';
import { useEvent } from '../data/hooks';
import { useGoBack } from '../navigation/useGoBack';
import { useColumnContent } from '../constants/layout';
import GoingView from './GoingView';

export default function GoingScreen({ route }: any) {
  const column = useColumnContent();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const goBack = useGoBack();
  const { eventId } = route.params;
  const { detail: event } = useEvent(eventId);
  const proof = useQuery({
    queryKey: ['eventParticipants', eventId, userId],
    queryFn: () => withTimeout(fetchSocialProof([eventId], { throwOnError: true })),
    staleTime: 0,
    enabled: !!supabase,
  });
  const data = proof.data?.get(eventId);
  const totalGoing = data?.totalGoing ?? 0;
  const state = proof.isError ? 'error' : !!supabase && proof.isPending ? 'loading'
    : !data ? 'unavailable' : totalGoing === 0 ? 'empty' : 'ready';
  return <GoingView eventTitle={event?.title} totalGoing={totalGoing}
    friends={data?.friends ?? []} friendsCount={data?.friendsCount ?? 0} state={state}
    top={insets.top} bottom={insets.bottom} column={column}
    onBack={goBack} onRetry={() => { void proof.refetch(); }} />;
}
