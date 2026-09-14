import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { trash} from "../../iconComponent/svgIcons";
import { SvgXml } from "react-native-svg";
import NotificationDot from "../../iconComponent/NotificationDot";
type Props = {
  id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
  onDelete: (id: number) => void;
  onPress?: () => void;
};

export default function NotificationCard(props: Props) {
  // Simple date formatter (can be improved with date-fns/dayjs)
  const formattedDate = new Date(props.createdAt).toLocaleString();

  return (
    <Pressable style={styles.card} onPress={props.onPress}>
      <NotificationDot
        style={{ position: "absolute", top: 0, left: 10 }}
        color={props.isRead ? "#D9D9D9" : "#90CDF4"}
        stroke={props.isRead ? "#8C8C8C" : "#4299E1"}
      />
      <View style={{ flexDirection: "row", alignItems: 'center' }}>
        <Text
          style={{
            marginStart: 10,
            fontFamily: "Inter-SemiBold",
            fontSize: 14,
            color: "#1B2351",
            flex: 1,
          }}
        >
          {props.message}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: 'center',
          marginTop: 5,
          marginStart: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-Regular",
            color: "#8C8C8C",
            fontSize: 10,
          }}
        >
          {formattedDate}
        </Text>
        <Pressable onPress={() => props.onDelete(props.id)} style={{ padding: 5 }}>
          <SvgXml xml={trash} width={13} height={13} />
        </Pressable>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
