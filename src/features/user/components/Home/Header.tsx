import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import AppLogo from "../../../../Components/AppLogo";
import { SvgXml } from "react-native-svg";
import {
  notiSvg,
  searchSvg,
  messageSvg,
} from "../../../../assests/icons/AllIcon";
import { scale } from "react-native-size-matters";
import { useUnreadCount } from "../../hooks/useNotifications";
import { useChatRooms } from "../../hooks/useChat";
import { useNavigation } from "@react-navigation/native";
import { UserStackParamList } from "../../../../Navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChatContext } from "../../chatContext/ChatContext";

interface HeaderProps {
  onSearchPress?: () => void;
}

const Header = ({ onSearchPress }: HeaderProps) => {
  type UserStackNavProp = NativeStackNavigationProp<UserStackParamList>;
  const navigation = useNavigation<UserStackNavProp>();
  const { roomUpdatedReadCount } = useContext(ChatContext);

  const { data: unreadCountResponse } = useUnreadCount();
  const unreadCount = unreadCountResponse?.data || 0;

  const { data: chatRoomsResponse } = useChatRooms();
  const rooms = chatRoomsResponse?.data ?? [];
  let chatUnreadCount = rooms.reduce(
    (sum: number, r: any) => sum + (r.unreadCount || 0),
    0
  );
  if (roomUpdatedReadCount?.roomIdDec) {
    const room = rooms.find((r: any) => r.roomIdDec === roomUpdatedReadCount.roomIdDec);
    if (room) {
      chatUnreadCount = chatUnreadCount - (room.unreadCount || 0) + roomUpdatedReadCount.count;
    }
  }

  return (
    <View style={styles.wrapper}>
      {/* 🔹 Top Row */}
      <View style={styles.container}>
        <AppLogo />

        <View style={styles.rightIcons}>
          {/* Notifications */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <View>
              <SvgXml xml={notiSvg} width={25} height={25} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          {/*  Messages */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("ChatScreen")}
          >
            <View>
              <SvgXml xml={messageSvg} width={27} height={27} />
              {chatUnreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {chatUnreadCount > 9 ? "9+" : chatUnreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔍 Search Input تحت */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (onSearchPress) {
            onSearchPress();
          } else {
            navigation.navigate("SearchExplore");
          }
        }}
        style={styles.searchContainer}
      >
        <SvgXml xml={searchSvg} width={18} height={18} />
        <Text style={styles.placeholder}>Search for your favorite product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: {
    
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
    gap: scale(10),
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(2),
  },

  iconBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
  },

  /* 🔍 Search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: scale(14),
    paddingHorizontal: scale(12),
    height: scale(45),
    gap: scale(8),
  },

  placeholder: {
    color: "#888",
    fontSize: scale(13),
  },

  /* 🔔 Badge */
  badge: {
    position: "absolute",
    top: -scale(2),
    right: -scale(2),
    backgroundColor: "#FF3B30",
    borderRadius: scale(8),
    minWidth: scale(16),
    height: scale(16),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(2),
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  badgeText: {
    color: "#fff",
    fontSize: scale(9),
    fontWeight: "bold",
  },
});
