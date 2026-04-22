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
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const AddNewServiceScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const rtl = isRTL();

  const [serviceTitle, setServiceTitle] = useState('');
  const [price, setPrice] = useState('');
  const [locationPin, setLocationPin] = useState('');

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
          <Text style={styles.headerTitle}>Add New Service</Text>
          <View style={styles.iconBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <InputField
            label="Service Title"
            placeholder="enter your Service Title"
            value={serviceTitle}
            onChangeText={setServiceTitle}
            labelStyle={[styles.fieldLabel, rtl && styles.textRtl]}
            inputWrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
            placeholderColor="#A7AEC1"
            containerStyle={styles.fieldContainer}
          />

          <InputField
            label="Price Upon Viewing"
            placeholder="Enter Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            labelStyle={[styles.fieldLabel, rtl && styles.textRtl]}
            inputWrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
            placeholderColor="#A7AEC1"
            containerStyle={styles.fieldContainer}
          />

          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>Time</Text>
          <TouchableOpacity
            style={styles.timeSelector}
            onPress={() => navigation.navigate('ProviderTime')}
            activeOpacity={0.8}
          >
            <Ionicons name="time-outline" size={18} color="#A7AEC1" />
            <Text style={styles.timePlaceholder}>Select your Time</Text>
          </TouchableOpacity>

          <InputField
            label="Location Pin"
            placeholder="Create your username"
            value={locationPin}
            onChangeText={setLocationPin}
            labelStyle={[styles.fieldLabel, rtl && styles.textRtl]}
            inputWrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
            placeholderColor="#A7AEC1"
            containerStyle={styles.fieldContainer}
          />

          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>Image Upload Icon</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
            <View style={styles.uploadIconCircle}>
              <Ionicons name="arrow-up-circle-outline" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.uploadText}>Image Upload</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Add New Service"
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
  fieldLabel: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 8,
    textAlign: 'left',
  },
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
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F5F6FA',
    borderColor: '#F0F1F5',
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 18,
  },
  timePlaceholder: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#A7AEC1',
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
