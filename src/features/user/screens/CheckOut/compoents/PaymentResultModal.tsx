import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { s } from 'react-native-size-matters';
import { lightColors } from "../../../../../../theme";
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { errorIconXml, successIconXml } from '../../../../../assests/icons/AllIcon';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';


export interface PaymentResultModalProps {
  visible: boolean;
  status: 'success' | 'error' | null;
  onTrackOrder?: () => void;
  onTryAgain?: () => void;
  onChangePayment?: () => void;
}

const PaymentResultModal = ({
  visible,
  status,
  onTrackOrder,
  onTryAgain,
  onChangePayment,
}: PaymentResultModalProps) => {
  const { t } = useTranslation();
  if (!status) return null;
  
  const isSuccess = status === 'success';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={20} tint="dark" style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: lightColors.white }]}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconBackground, { backgroundColor: lightColors.white }]}>
              <SvgXml xml={isSuccess ? successIconXml : errorIconXml} />
            </View>
          </View>

          <Text style={[styles.title, { color: lightColors.primary }]}>
            {isSuccess ? t("done") : t("paymentFailed")}
          </Text>

          <Text style={styles.subtitle}>
            {isSuccess
              ? t("cardCharged")
              : t("tryAgainLater")}
          </Text>

          {isSuccess ? (
            <TouchableOpacity activeOpacity={0.8} onPress={onTrackOrder}>
              <LinearGradient
                colors={[lightColors.secondary, lightColors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={[styles.primaryButtonText, { color: lightColors.white }]}>{t("trackMyOrder")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.errorButtonsContainer}>
              <TouchableOpacity activeOpacity={0.8} onPress={onTryAgain} style={{ flex: 1, marginEnd: 10 }}>
                <LinearGradient
                colors={[lightColors.secondary, lightColors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={[styles.primaryButtonText, { color: lightColors.white }]}>{t("tryAgain")}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.gradientButton, { backgroundColor: '#4B5563', flex: 1 }]} 
                activeOpacity={0.8} 
                onPress={onChangePayment}
              >
                <Text style={[styles.secondaryButtonText, { color: lightColors.white }]}>{t("change")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default PaymentResultModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(25),
  },
  modalContainer: {
    width: '100%',
    borderRadius: s(16),
    paddingTop: s(40),
    paddingBottom: s(30),
    paddingHorizontal: s(20),
    alignItems: 'center',
    position: 'relative',
    marginTop: s(25), 
  },
  iconContainer: {
    position: 'absolute',
    top: -s(28),
    alignSelf: 'center',
  },
  iconBackground: {
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: s(16),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: s(10),
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: s(12),
    color: '#666',
    textAlign: 'center',
    marginBottom: s(25),
    lineHeight: s(18),
    fontFamily: 'Inter',
  },
  gradientButton: {
    height: s(40),
    borderRadius: s(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  primaryButtonText: {
    fontSize: s(13),
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  secondaryButtonText: {
    fontSize: s(13),
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  errorButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
