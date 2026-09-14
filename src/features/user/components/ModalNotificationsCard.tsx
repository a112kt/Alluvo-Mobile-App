import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GradientText from "../../../Components/GradientText";
import { scale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import { Divider } from "react-native-paper";
export default function ModalNotificationsCard({ 
  open, 
  onMarkAllAsRead, 
  onClearAll 
}: { 
  open: boolean; 
  onMarkAllAsRead?: () => void; 
  onClearAll?: () => void; 
}) {
  return (
    <View style={[styles.container, { backgroundColor: lightColors.white, display: open ? "flex" : "none" }]}>
      <TouchableOpacity style={styles.mark} onPress={onMarkAllAsRead}>
        <GradientText text="Mark all as read" textStyle={styles.modaltxt} />
      </TouchableOpacity>
      <Divider
        bold
        style={{ width: "88%", backgroundColor: lightColors.iconGray }}
      />
      <TouchableOpacity style={styles.clear} onPress={onClearAll}>
        <Text style={styles.clearText}>Clear all</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: scale(180),
    height: scale(100),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(12),
    alignSelf: "flex-end",
    position: "absolute",
    top: 40,
    right: 10,
    zIndex: 5,
  },
  modaltxt: {
    fontFamily: "Inter-Meduim",
    fontSize: 18,
  },
  mark: {
    flexDirection: "row",
    gap: scale(4),
    justifyContent: "center",
    alignItems: "center",

    width: "88%",
    padding: scale(5),
  },
  clear: {
    flexDirection: "row",
    gap: scale(4),
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(6),
  },
  clearText: {
    fontSize: scale(20),
    color: "#F40000",
  },
});
