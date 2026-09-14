import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import BackBtn from './BackBtn';
import GradientText from '../../../../Components/GradientText';

type HeaderProps = {
  text: string;
};

const Header: React.FC<HeaderProps> = ({ text }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backBtnContainer}
        >
          <BackBtn />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <GradientText 
            text={text}
            gradientColors={[ '#47C0D2','#1B2351']}
            textStyle={styles.titleText}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        <View style={styles.spacer} />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical:Platform.OS === 'ios' ? verticalScale(1) : verticalScale(12),
    paddingHorizontal: 0,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(0),
  },
  backBtnContainer: {
    padding: 0,
    marginEnd: scale(12),
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: scale(26),
    fontWeight: '400',
    fontFamily: 'Inter',
    textAlign: "left",
    letterSpacing: -0.16,
  },
  spacer: {
    width: scale(40),
  },
});
