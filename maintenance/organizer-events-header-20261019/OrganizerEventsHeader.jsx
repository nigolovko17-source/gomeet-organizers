/** Existing RN runtime bindings are provided by build.cjs. No data or mode changes. */
function OrganizerEventsHeader() {
  const navigation = HeaderNavigation.useNavigation();
  const insets = HeaderSafeArea.useSafeAreaInsets();
  const column = HeaderLayout.useColumnContent();
  return <HeaderView style={{paddingTop: insets.top}}>
    <HeaderView style={[eventsHeaderStyles.row, column]}>
      <HeaderText style={eventsHeaderStyles.eyebrow}>Режим организатора</HeaderText>
      <HeaderPressable accessibilityLabel="Уведомления" accessibilityRole="button"
        onPress={() => navigation.navigate('Notifications')} style={eventsHeaderStyles.round}>
        <HeaderSvg width={20} height={20} viewBox="0 0 24 24" fill="none"
          stroke={HeaderColors.text} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" accessible={false}>
          <HeaderPath d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4zM10 21h4" />
        </HeaderSvg>
      </HeaderPressable>
    </HeaderView>
  </HeaderView>;
}
const eventsHeaderStyles = HeaderStyleSheet.create({
  row: {minHeight:68,paddingTop:12,paddingBottom:8,paddingHorizontal:24,
    flexDirection:'row',alignItems:'center',gap:12},
  eyebrow: {flex:1,fontFamily:HeaderFonts.bodyMedium,fontSize:12,lineHeight:18,color:HeaderColors.textSecondary},
  round: {width:44,height:44,minWidth:44,minHeight:44,borderWidth:1,borderColor:HeaderColors.border,
    borderRadius:22,alignItems:'center',justifyContent:'center'},
});
