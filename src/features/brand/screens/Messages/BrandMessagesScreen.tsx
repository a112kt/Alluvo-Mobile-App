import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { scale, vs, ms, s } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { ChatContext } from "../../../user/chatContext/ChatContext";
import { useRoomList } from "../../../user/hooks/useChat";
import { RoomType } from "../../../user/services/chat";
import { lightColors } from "../../../../../theme";
import { ConversationSkeleton } from "../../components/SkeletonLoader";

function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(timeStr: string): string {
  const now = Date.now();
  const then = new Date(timeStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timeStr).toLocaleDateString();
}

export default function BrandMessagesScreen() {
  const navigation = useNavigation<any>();

  const {
    setChatSearch,
    chatSearch,
    setSelectedChat,
    activeChatId,
    roomUpdatedReadCount,
    connection,
  } = useContext(ChatContext);

  const {
    data: roomList,
    isError,
    isLoading,
    isSuccess,
    refetch,
  } = useRoomList();

  const [filteredChats, setFilteredChats] = useState<RoomType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (roomList?.data && roomList.data.length > 0) {
      setFilteredChats(
        roomList.data.filter((chat: RoomType) =>
          chat.userName.toLowerCase().includes(chatSearch.toLowerCase()),
        ),
      );
    }
  }, [chatSearch, roomList]);

  useEffect(() => {
    if (isSuccess && roomList?.data) {
      setFilteredChats(roomList.data);
    }
  }, [isSuccess, roomList]);

  useEffect(() => {
    if (roomUpdatedReadCount?.roomIdDec && roomList?.data) {
      setFilteredChats((prev) =>
        prev.map((chat: RoomType) =>
          chat.roomIdDec === roomUpdatedReadCount.roomIdDec
            ? { ...chat, unreadCount: roomUpdatedReadCount.count }
            : chat,
        ),
      );
    }
  }, [roomUpdatedReadCount, roomList]);

  useEffect(() => {
    if (!connection) return;
    const onRoomCreated = () => refetch();
    connection.on("OnRoomCreated", onRoomCreated);
    return () => {
      connection.off("OnRoomCreated", onRoomCreated);
    };
  }, [connection, refetch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleChatSelect = useCallback(
    (chat: RoomType) => {
      setSelectedChat(chat);
      navigation.navigate("BrandChat", {
        roomIdEncr: chat.roomIdEnc,
        brandName: chat.userName,
        brandImage: chat.userImageUrl,
      });
    },
    [setSelectedChat, navigation],
  );

  const rooms: RoomType[] = filteredChats;
  const totalUnread = rooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);

  const renderRoom = ({ item }: { item: RoomType }) => {
    const isSelected = activeChatId === item.roomIdDec;
    const avatarColor = stringToColor(item.userName);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.roomCard,
          isSelected && { backgroundColor: "rgba(27,35,81,0.06)" },
        ]}
        onPress={() => handleChatSelect(item)}
      >
        <View style={styles.roomCardInner}>
          <View style={styles.roomAvatarWrap}>
            {item.userImageUrl ? (
              <Image source={{ uri: item.userImageUrl }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: avatarColor }]}>
                <Text style={styles.avatarInitials}>{getInitials(item.userName)}</Text>
              </View>
            )}
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.roomContent}>
            <View style={styles.roomTopRow}>
              <Text
                style={[styles.roomName, { color: lightColors.textTitle }]}
                numberOfLines={1}
              >
                {item.userName}
              </Text>
              {(item.unreadCount || 0) > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>
                    {item.unreadCount > 99 ? "99+" : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.roomBottomRow}>
              <Text style={styles.roomLastMessage} numberOfLines={1}>
                Tap to open conversation
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: lightColors.bgLight }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: lightColors.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(22)} color={lightColors.textTitle} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: lightColors.textTitle }]}>Messages</Text>
        {totalUnread > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{totalUnread}</Text>
          </View>
        )}
      </View>

      <View style={[styles.searchContainer, { backgroundColor: lightColors.white, borderColor: lightColors.separator }]}>
        <Ionicons name="search-outline" size={s(18)} color={lightColors.textHint} />
        <TextInput
          style={[styles.searchInput, { color: lightColors.textTitle }]}
          placeholder="Search conversations..."
          placeholderTextColor={lightColors.textHint}
          value={chatSearch}
          onChangeText={setChatSearch}
          returnKeyType="search"
        />
        {chatSearch.length > 0 && (
          <TouchableOpacity onPress={() => setChatSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={s(20)} color={lightColors.textHint} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: lightColors.textHint }]}>Conversations</Text>
        <Text style={[styles.sectionCount, { color: lightColors.textHint }]}>{rooms.length}</Text>
      </View>

      {isLoading ? (
        <View style={styles.listContent}>
          {[1, 2, 3, 4, 5].map((i) => (
            <ConversationSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.roomIdEnc}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={lightColors.primary}
              colors={[lightColors.primary]}
            />
          }
          ListEmptyComponent={
            isError ? (
              <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={s(48)} color={lightColors.textDanger} />
                <Text style={[styles.emptyText, { color: lightColors.textDanger }]}>
                  Failed to load conversations
                </Text>
                <TouchableOpacity
                  style={[styles.retryBtn, { backgroundColor: lightColors.primary }]}
                  onPress={() => refetch()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.centerContainer}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="chatbubbles-outline" size={s(40)} color={lightColors.textInactive} />
                </View>
                <Text style={[styles.emptyTitle, { color: lightColors.textSubtitle }]}>
                  No conversations yet.
                </Text>
                <Text style={[styles.emptyDesc, { color: lightColors.textHint }]}>
                  When customers message your brand, {"\n"}they will appear here.
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: vs(12),
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: scale(6),
  },
  headerTitle: {
    fontSize: s(20),
    fontWeight: "600",
    marginStart: scale(12),
    flex: 1,
  },
  headerBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: scale(10),
    minWidth: scale(20),
    height: scale(20),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(6),
  },
  headerBadgeText: {
    color: "#FFF",
    fontSize: s(11),
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(14),
    marginHorizontal: scale(16),
    marginTop: vs(10),
    marginBottom: vs(6),
    paddingHorizontal: scale(14),
    height: scale(42),
    gap: scale(10),
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: s(14),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingVertical: vs(8),
    marginTop: vs(2),
  },
  sectionTitle: {
    fontSize: s(12),
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: s(12),
  },
  listContent: {
    paddingHorizontal: scale(12),
    paddingBottom: vs(100),
    paddingTop: vs(4),
  },
  roomCard: {
    borderRadius: scale(14),
    marginBottom: vs(4),
    overflow: "hidden",
  },
  roomCardInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(12),
    paddingHorizontal: scale(12),
  },
  roomAvatarWrap: {
    width: scale(48),
    height: scale(48),
    marginEnd: s(14),
    position: "relative",
  },
  avatarImage: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
  },
  avatarPlaceholder: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    color: "#FFF",
    fontSize: s(13),
    fontWeight: "600",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: lightColors.bgLight,
  },
  roomContent: {
    flex: 1,
  },
  roomTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomName: {
    fontSize: s(15),
    fontWeight: "500",
    flex: 1,
    marginEnd: s(8),
  },
  roomBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: vs(2),
  },
  roomLastMessage: {
    fontSize: s(13),
    color: "#6B7280",
    flex: 1,
    marginRight: s(8),
  },
  unreadBadge: {
    backgroundColor: lightColors.primary,
    borderRadius: scale(10),
    minWidth: scale(20),
    height: scale(20),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(6),
  },
  unreadText: {
    color: "#FFF",
    fontSize: s(10),
    fontWeight: "700",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: vs(60),
    gap: vs(12),
  },
  emptyIconWrap: {
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: s(17),
    fontWeight: "700",
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: s(13),
    textAlign: "center",
    lineHeight: s(20),
  },
  emptyText: {
    fontSize: s(14),
    textAlign: "center",
    paddingHorizontal: s(16),
  },
  retryBtn: {
    marginTop: vs(10),
    paddingHorizontal: s(24),
    paddingVertical: vs(10),
    borderRadius: scale(10),
  },
  retryText: {
    color: "#FFF",
    fontSize: s(14),
    fontWeight: "600",
  },
});
