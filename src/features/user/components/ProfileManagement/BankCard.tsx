import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { scale, verticalScale } from "react-native-size-matters";
import GradientButton from "../../../../Components/buttons/GradientButton";
import { SvgXml } from "react-native-svg";
import { lightColors } from "../../../../../theme";
import EditModal from "./EditModal";


const BankCard= () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState("");

  const openEdit = () => {
    setModalType("Edit Card");
    setModalVisible(true);
  };



  const CardItemSvg = `<svg width="57" height="35" viewBox="0 0 57 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_806_8035)">
<rect x="20.5449" y="3.68408" width="15.1614" height="27.3167" fill="#FF5F00"/>
<path d="M21.4596 17.4078C21.4596 12.0491 23.943 7.08237 28.1254 3.68414C20.5448 -2.19745 9.69658 -0.890409 3.68413 6.55951C-2.19746 14.1403 -0.890393 24.9885 6.55956 31.0009C12.8333 35.9675 21.721 35.9675 27.9947 31.0009C23.943 27.7333 21.4596 22.7666 21.4596 17.4078Z" fill="#EB001B"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M56.2259 17.4074C56.2259 26.9487 48.5145 34.7908 38.8425 34.7908C34.9216 34.7908 31.1312 33.4837 28.125 31.1311C35.7056 25.2496 37.0128 14.2706 31.0005 6.8206C30.0855 5.775 29.1706 4.72935 28.125 3.94511C35.7056 -1.93645 46.5539 -0.629445 52.4354 6.8206C54.9188 9.69602 56.2259 13.4864 56.2259 17.4074ZM54.5269 28.125V27.6022H54.7881V27.4715H54.2653V27.6022H54.5269V28.125ZM55.7031 28.125V27.4715H55.5724L55.311 27.9943L55.0496 27.4715H54.9188V28.125H55.0496V27.6022L55.311 27.9943H55.4416L55.5723 27.6022V28.125H55.7031Z" fill="#F79E1B"/>
</g>
<defs>
<clipPath id="clip0_806_8035">
<rect width="56.2259" height="34.7908" fill="white"/>
</clipPath>
</defs>
</svg>
`;
  const TimeSVG = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.375 18.75C7.1875 18.75 5.25174 18.0861 3.56771 16.7583C1.88368 15.4306 0.789931 13.7333 0.286458 11.6667C0.217014 11.4062 0.269097 11.1677 0.442708 10.951C0.616319 10.7344 0.850694 10.6083 1.14583 10.5729C1.42361 10.5382 1.67535 10.5903 1.90104 10.7292C2.12674 10.8681 2.28299 11.0764 2.36979 11.3542C2.78646 12.9167 3.64583 14.1927 4.94792 15.1823C6.25 16.1719 7.72569 16.6667 9.375 16.6667C11.4062 16.6667 13.1295 15.9594 14.5448 14.5448C15.9601 13.1302 16.6674 11.4069 16.6667 9.375C16.666 7.34306 15.9587 5.62014 14.5448 4.20625C13.1309 2.79236 11.4076 2.08472 9.375 2.08333C8.17708 2.08333 7.05729 2.36111 6.01562 2.91667C4.97396 3.47222 4.09722 4.23611 3.38542 5.20833H5.20833C5.50347 5.20833 5.75104 5.30833 5.95104 5.50833C6.15104 5.70833 6.25069 5.95556 6.25 6.25C6.24931 6.54444 6.14931 6.79201 5.95 6.99271C5.75069 7.1934 5.50347 7.29306 5.20833 7.29167H1.04167C0.746528 7.29167 0.499306 7.19167 0.3 6.99167C0.100695 6.79167 0.000694444 6.54444 0 6.25V2.08333C0 1.78819 0.1 1.54097 0.3 1.34167C0.5 1.14236 0.747222 1.04236 1.04167 1.04167C1.33611 1.04097 1.58368 1.14097 1.78437 1.34167C1.98507 1.54236 2.08472 1.78958 2.08333 2.08333V3.48958C2.96875 2.37847 4.04965 1.5191 5.32604 0.911458C6.60243 0.303819 7.95208 0 9.375 0C10.6771 0 11.8969 0.24757 13.0344 0.742708C14.1719 1.23785 15.1615 1.9059 16.0031 2.74688C16.8448 3.58785 17.5132 4.57743 18.0083 5.71563C18.5035 6.85382 18.7507 8.07361 18.75 9.375C18.7493 10.6764 18.5021 11.8962 18.0083 13.0344C17.5146 14.1726 16.8462 15.1622 16.0031 16.0031C15.1601 16.8441 14.1705 17.5125 13.0344 18.0083C11.8983 18.5042 10.6785 18.7514 9.375 18.75ZM10.4167 8.95833L13.0208 11.5625C13.2118 11.7535 13.3073 11.9965 13.3073 12.2917C13.3073 12.5868 13.2118 12.8299 13.0208 13.0208C12.8299 13.2118 12.5868 13.3073 12.2917 13.3073C11.9965 13.3073 11.7535 13.2118 11.5625 13.0208L8.64583 10.1042C8.54167 10 8.46354 9.88299 8.41146 9.75312C8.35937 9.62326 8.33333 9.48854 8.33333 9.34896V5.20833C8.33333 4.91319 8.43333 4.66597 8.63333 4.46667C8.83333 4.26736 9.08055 4.16736 9.375 4.16667C9.66944 4.16597 9.91701 4.26597 10.1177 4.46667C10.3184 4.66736 10.4181 4.91458 10.4167 5.20833V8.95833Z" fill="url(#paint0_linear_806_8051)"/>
<defs>
<linearGradient id="paint0_linear_806_8051" x1="0" y1="9.375" x2="18.75" y2="9.375" gradientUnits="userSpaceOnUse">
<stop stop-color="#47C0D2"/>
<stop offset="1" stop-color="#1B2351"/>
</linearGradient>
</defs>
</svg>
`;

  const EditSVG = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.4165 2.07959H3.12484C2.5723 2.07959 2.0424 2.29908 1.6517 2.68978C1.261 3.08048 1.0415 3.61039 1.0415 4.16292V18.7463C1.0415 19.2988 1.261 19.8287 1.6517 20.2194C2.0424 20.6101 2.5723 20.8296 3.12484 20.8296H17.7082C18.2607 20.8296 18.7906 20.6101 19.1813 20.2194C19.572 19.8287 19.7915 19.2988 19.7915 18.7463V11.4546" stroke="url(#paint0_linear_806_8053)" stroke-width="2.08333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.0571 1.68896C17.4715 1.27456 18.0335 1.04175 18.6196 1.04175C19.2056 1.04175 19.7677 1.27456 20.1821 1.68896C20.5965 2.10336 20.8293 2.66541 20.8293 3.25146C20.8293 3.83751 20.5965 4.39956 20.1821 4.81396L10.7935 14.2035C10.5462 14.4507 10.2406 14.6316 9.90498 14.7296L6.91227 15.6046C6.82264 15.6307 6.72762 15.6323 6.63718 15.6091C6.54673 15.5859 6.46418 15.5389 6.39815 15.4729C6.33213 15.4068 6.28507 15.3243 6.2619 15.2338C6.23873 15.1434 6.2403 15.0484 6.26644 14.9587L7.14144 11.966C7.2399 11.6307 7.42116 11.3255 7.66852 11.0785L17.0571 1.68896Z" stroke="url(#paint1_linear_806_8053)" stroke-width="2.08333" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_806_8053" x1="1.0415" y1="11.4546" x2="19.7915" y2="11.4546" gradientUnits="userSpaceOnUse">
<stop stop-color="#47C0D2"/>
<stop offset="1" stop-color="#1B2351"/>
</linearGradient>
<linearGradient id="paint1_linear_806_8053" x1="6.24561" y1="8.33358" x2="20.8293" y2="8.33358" gradientUnits="userSpaceOnUse">
<stop stop-color="#47C0D2"/>
<stop offset="1" stop-color="#1B2351"/>
</linearGradient>
</defs>
</svg>
`;

  const DeleteSVG = `<svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.75 22.5C3.0625 22.5 2.47417 22.2554 1.985 21.7663C1.49583 21.2771 1.25083 20.6883 1.25 20V3.75H0V1.25H6.25V0H13.75V1.25H20V3.75H18.75V20C18.75 20.6875 18.5054 21.2763 18.0163 21.7663C17.5271 22.2563 16.9383 22.5008 16.25 22.5H3.75ZM16.25 3.75H3.75V20H16.25V3.75ZM6.25 17.5H8.75V6.25H6.25V17.5ZM11.25 17.5H13.75V6.25H11.25V17.5Z" fill="#E41818"/>
</svg>
`;

  return (
    <View style={styles.container}>
      <View style={styles.CardHeader}>
        <SvgXml xml={CardItemSvg} />
        <View style={styles.SvgContainer}>
          <View style={styles.SvgStyle}>
            <SvgXml xml={TimeSVG} width={18} height={18} />
          </View>
          <TouchableOpacity style={styles.SvgStyle} onPress={openEdit}>
            <SvgXml xml={EditSVG} width={18} height={18} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.deletSvg}>
            <SvgXml xml={DeleteSVG} width={18} height={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={{ fontSize: scale(17) }}>**** **** **** ****</Text>
        <Text style={{ fontSize: scale(17) }}>1579</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>Ashrakta Rafaat</Text>
        <Text>21/11</Text>
      </View>

      {/* Modal */}
      <EditModal
        visible={modalVisible}
        title={modalType}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          console.log("Confirmed:", modalType);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

export default BankCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(10),
    backgroundColor: lightColors.iconLight,
    width: scale(280),
    height: verticalScale(155),
    marginTop: verticalScale(8),
  },
  CardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  SvgContainer: {
    flexDirection: "row",
    gap: scale(10),
  },
  SvgStyle: {
    backgroundColor: "#47C0D21A",
    width: scale(35),
    height: verticalScale(35),
    borderRadius: scale(17.5),
    justifyContent: "center",
    alignItems: "center",
  },
  deletSvg: {
    backgroundColor: "#E418181A",
    width: scale(35),
    height: verticalScale(35),
    borderRadius: scale(17.5),
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(33),
    marginBottom: verticalScale(15),
  },
});
