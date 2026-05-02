import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const TeamsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const rtl = isRTL();

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={[styles.header, rtl && styles.headerRtl]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('teams.title')}</Text>
          <View style={styles.iconBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <InputField
            label={t('teams.teamName')}
            placeholder={t('teams.teamNamePlaceholder')}
            value={teamName}
            onChangeText={setTeamName}
            labelStyle={[styles.fieldLabel, rtl && styles.textRtl]}
            inputWrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
            placeholderColor="#A7AEC1"
            containerStyle={styles.fieldContainer}
          />

          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('teams.teamDescription')}</Text>
          <View style={[styles.textAreaWrapper, styles.fieldContainer]}>
            <InputField
              label=""
              placeholder={t('teams.teamDescriptionPlaceholder')}
              value={teamDescription}
              onChangeText={setTeamDescription}
              multiline
              numberOfLines={4}
              labelStyle={styles.hiddenLabel}
              inputWrapperStyle={styles.textAreaInner}
              inputStyle={[styles.fieldInput, styles.textAreaInput]}
              placeholderColor="#A7AEC1"
              containerStyle={styles.noMargin}
            />
          </View>

          <InputField
            label={t('teams.teamMembers')}
            placeholder={t('teams.teamMembersPlaceholder')}
            value={teamMembers}
            onChangeText={setTeamMembers}
            labelStyle={[styles.fieldLabel, rtl && styles.textRtl]}
            inputWrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
            placeholderColor="#A7AEC1"
            containerStyle={styles.fieldContainer}
          />

          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('teams.profileImage')}</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="arrow-up-circle-outline" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.uploadText}>{t('teams.imageUpload')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addMembersBtn} activeOpacity={0.8}>
            <Ionicons name="add-circle-outline" size={22} color="#1B1D36" />
            <Text style={styles.addMembersBtnText}>{t('teams.addNewMembers')}</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t('teams.addNewTeams')}
            onPress={() => navigation.goBack()}
            style={styles.submitBtn}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRtl: { flexDirection: 'row-reverse' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scroll: { padding: 20, paddingBottom: 24 },
  fieldContainer: { marginBottom: 18 },
  noMargin: { marginBottom: 0 },
  fieldLabel: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 8,
    textAlign: 'left',
  },
  hiddenLabel: { display: 'none' },
  fieldWrapper: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F5F6FA',
    borderColor: '#F0F1F5',
    borderWidth: 1,
  },
  fieldInput: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#1E2239',
  },
  textAreaWrapper: {
    borderRadius: 10,
    backgroundColor: '#F5F6FA',
    borderColor: '#F0F1F5',
    borderWidth: 1,
    overflow: 'hidden',
  },
  textAreaInner: {
    height: 100,
    borderWidth: 0,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
  textAreaInput: {
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    borderStyle: 'dashed',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDF7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
  },
  addMembersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF7F6',
    borderRadius: 12,
    height: 52,
    gap: 8,
    marginBottom: 8,
  },
  addMembersBtnText: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  submitBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.primary,
  },
});
