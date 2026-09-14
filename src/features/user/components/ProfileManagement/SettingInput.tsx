import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { LinearGradient } from "expo-linear-gradient";
import { lightColors } from '../../../../../theme';
import { useTranslation } from 'react-i18next';

interface SettingInputProp {
  placeholder: string;
  showEdit?: boolean;
  onEditPress?: any;
  placeholderTextColor: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
}

const SettingInput: React.FC<SettingInputProp> = ({ 
  placeholder, 
  showEdit, 
  onEditPress, 
  placeholderTextColor,
  value,
  onChangeText,
  secureTextEntry
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputStyle}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          textAlign={"left"}
        />

        {showEdit && (
          <TouchableOpacity style={[styles.btnWrapper, { right: scale(10) }]}  onPress={onEditPress}>
            <LinearGradient
              colors={['#47C0D2', '#1B2351']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.editBtn}
            >
              <Text style={styles.editText}>{t("edit")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
};

export default SettingInput;

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(8),
  },

  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  inputStyle: {
    backgroundColor: lightColors.inputBackgound2,
    height: verticalScale(50),
    borderRadius: scale(9),
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: scale(16),
    letterSpacing: -0.17,
    color: lightColors.primary,
    paddingHorizontal: scale(12),
    paddingEnd: scale(80),
    textAlign: 'left',
  },

  btnWrapper: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -16 }],
  },

  editBtn: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(14),
    borderRadius: scale(7),
  },

  editText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: scale(13),
  },
});
