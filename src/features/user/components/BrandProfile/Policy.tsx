import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import GradientButton from '../../../../Components/buttons/GradientButton';
import { lightColors } from '../../../../../theme';
import { scale, verticalScale } from 'react-native-size-matters';
import UseBrandPolicy from '../../hooks/BrandProfile/useBrandPolicy';
import { ActivityIndicator } from 'react-native';
import HtmlText from '../../../../Components/HtmlText';

const Policy = ({ brandId }: { brandId: number }) => {
  const { response: policyData, loading, error } = UseBrandPolicy(brandId);

  if (loading) {
    return (
      <View style={[styles.centerContent, { alignItems: "center", justifyContent: "center", flex: 1 }]}>
        <ActivityIndicator size="small" color={lightColors.primary} />
      </View>
    );
  }

  // Hardcoded social links for now as the API doesn't seem to return them in a structured way yet
  const socialLinks = [
    { name: "Facebook", url: "https://facebook.com/OurBrandOfficial" },
    { name: "Instagram", url: "https://instagram.com/OurBrandOfficial" },
    { name: "TikTok", url: "https://www.tiktok.com/@OurBrandOfficial" },
  ];

  return (
    <View style={styles.centerContent}>
      <Text style={styles.placeholderText}>Our Policy</Text>
      {policyData?.returnPolicyAsHtml ? (
        <HtmlText html={policyData.returnPolicyAsHtml} />
      ) : (
        <Text style={styles.content}>No policy information available.</Text>
      )}

      <View style={styles.contact}>
        <Text style={styles.contactText}>Connect with us:</Text>
        <View>
          {socialLinks.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => Linking.openURL(item.url)}
              style={styles.row}
            >
              <Text style={styles.name}>{item.name}:</Text>
              <Text style={styles.url}>
                {item.url.replace("https://", "")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.blockbtn}>
        <GradientButton text="Block & Report" />
      </View>
    </View>
  )
}


export default Policy
const styles = StyleSheet.create({
  centerContent: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: verticalScale(20),
    paddingHorizontal:scale(10)
  },
  placeholderText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontStyle: "normal",
    fontSize: scale(20),
  },
  content: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: scale(10),
    letterSpacing: 0,
    includeFontPadding: false,
    color: "#4B5563",
    margin: scale(5),
    marginTop: verticalScale(10),
  },
  contact: {
    marginTop: verticalScale(10),
  },
  contactText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: scale(16),
    marginBottom: verticalScale(4),
  },
  name: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: scale(10),
    color: "#1B2351",
    marginEnd: scale(4),
  },
  url: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: scale(10),
    color: "#1B2351",
  },
  blockbtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(50),
    width: scale(160),
    marginStart: "auto",
    marginEnd: "auto",
  },
  // Row helper
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: verticalScale(6),
  },
});
