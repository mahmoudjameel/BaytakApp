import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal, type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';
import { TeamsService, Team, TeamMember } from '../../services/teams.service';
import { CategoriesService, Category, categoryDisplayName } from '../../services/categories.service';
import { toErrorMessage } from '../../utils/errors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const TeamsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { t, i18n } = useTranslation();
  const preferAr = (i18n.language ?? '').startsWith('ar');
  const rtl = isRTL();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [createVisible, setCreateVisible] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [createCategories, setCreateCategories] = useState<Category[]>([]);
  const [loadingCreateCategories, setLoadingCreateCategories] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [creating, setCreating] = useState(false);

  const [memberModalTeam, setMemberModalTeam] = useState<Team | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const loadTeams = useCallback(async () => {
    setLoadingTeams(true);
    try {
      const json = await TeamsService.getAll();
      setTeams(json);
    } catch {
      setTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadTeams();
    }, [loadTeams]),
  );

  useEffect(() => {
    if (!createVisible) return;
    setLoadingCreateCategories(true);
    CategoriesService.getAll({ limit: 60 })
      .then((res) => setCreateCategories(res.data ?? []))
      .catch(() => setCreateCategories([]))
      .finally(() => setLoadingCreateCategories(false));
  }, [createVisible]);

  const closeCreateModal = useCallback(() => {
    setCreateVisible(false);
    setTeamName('');
    setSelectedCategoryId(undefined);
  }, []);

  const openMemberModal = async (team: Team) => {
    setMemberModalTeam(team);
    setMemberName('');
    setMemberEmail('');
    setMemberPassword('');
    try {
      const members = await TeamsService.getMembers(team.id);
      setTeamMembers(members);
    } catch {
      setTeamMembers([]);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert(t('common.error'), t('teams.nameRequired'));
      return;
    }
    if (selectedCategoryId == null) {
      Alert.alert(t('common.error'), t('teams.categoryRequired'));
      return;
    }
    setCreating(true);
    try {
      const created = await TeamsService.create({
        name: teamName.trim(),
        categoryIds: [selectedCategoryId],
      });
      setTeams((prev) => [created, ...prev]);
      closeCreateModal();
      Alert.alert(t('common.success'), t('teams.teamCreated'));
    } catch (err: unknown) {
      Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberModalTeam) return;
    if (!memberName.trim() || !memberEmail.trim() || !memberPassword.trim()) {
      Alert.alert(t('common.error'), t('teams.memberFieldsRequired'));
      return;
    }
    setAddingMember(true);
    try {
      const member = await TeamsService.addMember(memberModalTeam.id, {
        fullName: memberName.trim(),
        email: memberEmail.trim().toLowerCase(),
        password: memberPassword.trim(),
      });
      setTeamMembers((prev) => [...prev, member]);
      setMemberName('');
      setMemberEmail('');
      setMemberPassword('');
      Alert.alert(t('common.success'), `${t('teams.memberAdded')}\n\n${t('teams.memberAddedLoginHint')}`);
    } catch (err: unknown) {
      Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = (teamId: number, member: TeamMember) => {
    Alert.alert(t('teams.removeMember'), `${member.fullName}?`, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('myAddresses.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await TeamsService.removeMember(teamId, member.id);
            setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
          } catch (err: unknown) {
            Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={[styles.header, rtl && styles.headerRtl]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('teams.title')}</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCreateVisible(true)}>
            <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {loadingTeams ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
          ) : teams.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="people-outline" size={52} color="#D0D5E3" />
              <Text style={styles.emptyText}>{t('teams.noTeams')}</Text>
              <TouchableOpacity style={styles.createFirstBtn} onPress={() => setCreateVisible(true)}>
                <Text style={styles.createFirstBtnText}>{t('teams.createNew')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.sectionLabel, rtl && styles.textRtl]}>{t('teams.myTeams')}</Text>
              {teams.map((team) => (
                <View key={team.id} style={[styles.teamCard, rtl && styles.rowRtl]}>
                  <View style={styles.teamIconCircle}>
                    <Ionicons name="people" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.teamBody}>
                    <Text style={[styles.teamName, rtl && styles.textRtl]}>{team.name}</Text>
                    {team.members != null && (
                      <Text style={[styles.teamMeta, rtl && styles.textRtl]}>
                        {t('teams.membersCount', { count: team.members.length })}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.manageBtn}
                    onPress={() => openMemberModal(team)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.manageBtnText}>{t('teams.manageMembers')}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </ScrollView>

        {!loadingTeams && teams.length > 0 && (
          <View style={styles.footer}>
            <Button title={t('teams.createNew')} onPress={() => setCreateVisible(true)} style={styles.submitBtn} />
          </View>
        )}

        <Modal visible={createVisible} transparent animationType="slide" onRequestClose={closeCreateModal}>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeCreateModal} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{t('teams.addNewTeams')}</Text>
              <TouchableOpacity onPress={closeCreateModal} hitSlop={12}>
                <Ionicons name="close" size={22} color="#1B1D36" />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetBody}>
              <InputField
                label={t('teams.teamName')}
                placeholder={t('teams.teamNamePlaceholder')}
                value={teamName}
                onChangeText={setTeamName}
                labelStyle={styles.fieldLabel}
                inputWrapperStyle={styles.fieldWrapper}
                inputStyle={styles.fieldInput}
                placeholderColor="#A7AEC1"
                containerStyle={{ marginBottom: 14 }}
              />
              <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('teams.serviceCategory')}</Text>
              {loadingCreateCategories ? (
                <ActivityIndicator color={Colors.primary} style={{ marginVertical: 12, alignSelf: rtl ? 'flex-end' : 'flex-start' }} />
              ) : createCategories.length === 0 ? (
                <Text style={[styles.categoryHint, rtl && styles.textRtl]}>{t('teams.noCategories')}</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryScroll}
                  contentContainerStyle={[styles.categoryChipsRow, rtl && styles.categoryChipsRowRtl]}
                >
                  {createCategories.map((cat) => {
                    const selected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryChip, selected ? styles.categoryChipOn : styles.categoryChipOff]}
                        onPress={() => setSelectedCategoryId(cat.id)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.categoryChipText, selected ? styles.categoryChipTextOn : styles.categoryChipTextOff]} numberOfLines={1}>
                          {categoryDisplayName(cat, preferAr)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
              {creating ? (
                <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
              ) : (
                <Button
                  title={t('teams.addNewTeams')}
                  onPress={handleCreateTeam}
                  style={StyleSheet.flatten([styles.submitBtn, { marginTop: 16 }]) as ViewStyle}
                />
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={memberModalTeam != null}
          transparent
          animationType="slide"
          onRequestClose={() => setMemberModalTeam(null)}
        >
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMemberModalTeam(null)} />
          <View style={[styles.sheet, { maxHeight: '80%' }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{memberModalTeam?.name ?? ''}</Text>
              <TouchableOpacity onPress={() => setMemberModalTeam(null)} hitSlop={12}>
                <Ionicons name="close" size={22} color="#1B1D36" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">
              {teamMembers.length > 0 && (
                <View style={styles.membersList}>
                  {teamMembers.map((m) => (
                    <View key={m.id} style={[styles.memberRow, rtl && styles.rowRtl]}>
                      <View style={styles.memberAvatar}>
                        <Ionicons name="person" size={16} color="#FFFFFF" />
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{m.fullName}</Text>
                        <Text style={styles.memberEmail}>{m.email}</Text>
                      </View>
                      <TouchableOpacity
                        hitSlop={8}
                        onPress={() => handleRemoveMember(memberModalTeam!.id, m)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#D72653" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>{t('teams.addMember')}</Text>
              <InputField
                label={t('teams.memberName')}
                placeholder={t('teams.memberName')}
                value={memberName}
                onChangeText={setMemberName}
                labelStyle={styles.fieldLabel}
                inputWrapperStyle={styles.fieldWrapper}
                inputStyle={styles.fieldInput}
                placeholderColor="#A7AEC1"
                containerStyle={{ marginBottom: 10 }}
              />
              <InputField
                label={t('teams.memberEmail')}
                placeholder={t('teams.memberEmail')}
                value={memberEmail}
                onChangeText={setMemberEmail}
                keyboardType="email-address"
                labelStyle={styles.fieldLabel}
                inputWrapperStyle={styles.fieldWrapper}
                inputStyle={styles.fieldInput}
                placeholderColor="#A7AEC1"
                containerStyle={{ marginBottom: 10 }}
              />
              <InputField
                label={t('teams.memberPassword')}
                placeholder={t('teams.memberPassword')}
                value={memberPassword}
                onChangeText={setMemberPassword}
                secureTextEntry
                labelStyle={styles.fieldLabel}
                inputWrapperStyle={styles.fieldWrapper}
                inputStyle={styles.fieldInput}
                placeholderColor="#A7AEC1"
                containerStyle={{ marginBottom: 20 }}
              />
              {addingMember ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Button title={t('teams.addMember')} onPress={handleAddMember} style={styles.submitBtn} />
              )}
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerRtl: { flexDirection: 'row-reverse' },
  rowRtl: { flexDirection: 'row-reverse' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scroll: { padding: 16, gap: 12, paddingBottom: 100 },
  emptyWrap: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular },
  createFirstBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  createFirstBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: FontFamily.outfit.semiBold },
  sectionLabel: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', marginBottom: 4 },
  teamCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, gap: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  teamIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EDF7F6', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  teamBody: { flex: 1, minWidth: 0 },
  teamName: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  teamMeta: { fontSize: 12, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular, marginTop: 3 },
  manageBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, flexShrink: 0 },
  manageBtnText: { color: '#FFFFFF', fontSize: 13, fontFamily: FontFamily.outfit.medium },
  footer: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8, backgroundColor: '#F5F6FA' },
  submitBtn: { height: 52, borderRadius: 14, backgroundColor: Colors.primary },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  sheetTitle: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  sheetBody: { padding: 16, paddingBottom: 24 },
  categoryScroll: { flexGrow: 0, marginBottom: 4 },
  categoryChipsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  categoryChipsRowRtl: { flexDirection: 'row-reverse' },
  categoryChip: { paddingHorizontal: 14, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', maxWidth: 220 },
  categoryChipOff: { backgroundColor: '#E8F1E3' },
  categoryChipOn: { backgroundColor: Colors.primary },
  categoryChipText: { fontSize: 12, fontFamily: FontFamily.outfit.medium },
  categoryChipTextOff: { color: '#1B1D36' },
  categoryChipTextOn: { color: '#FFFFFF' },
  categoryHint: { fontSize: 12, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular, marginTop: 4 },
  fieldLabel: { fontSize: 14, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', marginBottom: 6 },
  fieldWrapper: { height: 48, borderRadius: 10, backgroundColor: '#F5F6FA', borderColor: '#F0F1F5', borderWidth: 1 },
  fieldInput: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#1E2239' },
  membersList: { gap: 10, marginBottom: 6 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F5F6FA', borderRadius: 10, padding: 10 },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  memberInfo: { flex: 1, minWidth: 0 },
  memberName: { fontSize: 14, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  memberEmail: { fontSize: 12, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular },
});
