import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
  Keyboard,
  Animated,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { scale, vs, ms, s } from "react-native-size-matters";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ChatContext } from "../../../user/chatContext/ChatContext";
import { DecryptedMessageType } from "../../../user/services/chat";
import { useDeleteMessage } from "../../../user/hooks/useChat";
import {
  PendingIcon,
  CheckedIcon2,
  DoubleCheckedIcon,
} from "../../../../iconComponent/MessageStatusIcons";
import { lightColors } from "../../../../../theme";
import { ChatSkeleton } from "../../components/SkeletonLoader";
import AnimatedReanimated, { FadeIn } from "react-native-reanimated";

type BrandChatRouteProp = RouteProp<
  { BrandChat: { roomIdEncr: string; brandName: string; brandImage?: string } },
  "BrandChat"
>;

function formatRelativeTime(dateStr: string, now: Date): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "less than a minute ago";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}

function mapStatusIcon(status: string, size?: number) {
  switch (status) {
    case "DeliveredToServer":
      return <CheckedIcon2 size={size || 11} />;
    case "Delivered":
      return <DoubleCheckedIcon size={size || 11} />;
    case "Seen":
      return <DoubleCheckedIcon size={size || 11} color="#10B981" />;
    case "Pending":
      return <PendingIcon size={size || 11} />;
    case "Failed":
      return <Ionicons name="alert-circle" size={size || 13} color="#EF4444" />;
    default:
      return null;
  }
}

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

export default function BrandChatScreen() {
  const navigation = useNavigation();
  const route = useRoute<BrandChatRouteProp>();
  const { roomIdEncr, brandName, brandImage } = route.params;
  const insets = useSafeAreaInsets();

  const {
    selectedChat,
    setSelectedChat,
    chatMsgList,
    setChatMsgList,
    sendMessage,
    page,
    setPage,
    hasNextPage,
    isGetMessagesFetching,
    isGetMessagesLoading,
    fetchLockRef,
    goToBottom,
    setGoToBottom,
  } = useContext(ChatContext);

  const { mutate: deleteMessageMutate } = useDeleteMessage();

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");
  const [deleteMenuVisible, setDeleteMenuVisible] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [animatingMsgId, setAnimatingMsgId] = useState<string | null>(null);

  const sendBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (roomIdEncr) {
      if (!selectedChat || selectedChat.roomIdEnc !== roomIdEncr) {
        setSelectedChat({
          roomIdEnc: roomIdEncr,
          roomIdDec: roomIdEncr,
          userName: brandName,
          userImageUrl: brandImage || "",
          unreadCount: 0,
        });
      }
    }
  }, [roomIdEncr, brandName, brandImage]);

  useEffect(() => {
    return () => {
      setSelectedChat(null);
      setChatMsgList([]);
    };
  }, []);

  const scrollToEnd = useCallback((animated = true) => {
    const list = chatMsgList;
    if (flatListRef.current && list && list.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated });
      }, 50);
    }
  }, [chatMsgList ? chatMsgList.length : 0]);

  useEffect(() => {
    const list = chatMsgList;
    if (list && list.length > 0 && page === 1) {
      scrollToEnd(false);
    }
  }, [chatMsgList ? chatMsgList.length : 0, page]);

  useEffect(() => {
    const list = chatMsgList;
    if (goToBottom && list && list.length > 0) {
      scrollToEnd(true);
      const lastMsg = list[list.length - 1];
      const id = lastMsg?.messageIdDec || lastMsg?.messageIdEncr || `msg-${list.length}`;
      setAnimatingMsgId(id);
      const timer = setTimeout(() => setAnimatingMsgId(null), 600);
      setGoToBottom(false);
      return () => clearTimeout(timer);
    }
  }, [goToBottom, chatMsgList ? chatMsgList.length : 0, scrollToEnd, setGoToBottom]);

  const handleScroll = useCallback(
    (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      if (offsetY < 50 && hasNextPage && !isGetMessagesFetching && !fetchLockRef.current) {
        fetchLockRef.current = true;
        setPage((prev) => prev + 1);
      }
    },
    [hasNextPage, isGetMessagesFetching, fetchLockRef, setPage],
  );

  const handleDeleteMessage = useCallback((messageIdDec: string) => {
    setDeletingMessageId(messageIdDec);
    deleteMessageMutate(messageIdDec, {
      onSuccess: () => {
        setChatMsgList((prev) => prev.filter((m) => m.messageIdDec !== messageIdDec));
        setDeletingMessageId(null);
        setDeleteMenuVisible(false);
      },
      onError: () => {
        setDeletingMessageId(null);
      },
    });
  }, [deleteMessageMutate, setChatMsgList]);

  const handleSend = useCallback(() => {
    Keyboard.dismiss();
    const text = inputText.trim();
    if (!text) return;
    sendMessage(text);
    setInputText("");
  }, [inputText, sendMessage]);

  const handleSendPressIn = () => {
    Animated.spring(sendBtnScale, {
      toValue: 0.85,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  };

  const handleSendPressOut = () => {
    Animated.spring(sendBtnScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 40,
    }).start();
  };

  const renderMessage = useCallback(({ item }: { item: DecryptedMessageType }) => {
    const isMine = item.isMyMessage;
    const msgId = item.messageIdDec || item.messageIdEncr || "";
    const isNew = animatingMsgId === msgId;

    const bubbleContent = (
      <>
        {!isMine ? (
          <View style={styles.messageRowOther}>
            <View style={styles.otherAvatar}>
              {selectedChat?.userImageUrl ? (
                <Image source={{ uri: selectedChat.userImageUrl }} style={styles.otherAvatarImage} />
              ) : (
                <View style={[styles.otherAvatarPlaceholder, { backgroundColor: stringToColor(selectedChat?.userName || "?") }]}>
                  <Text style={styles.otherAvatarInitials}>
                    {selectedChat?.userName?.[0] || "?"}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.otherMessageBlock}>
              {item.createdAt && (
                <Text style={[styles.senderNameTime, { color: lightColors.textHint }]}>
                  {selectedChat?.userName},{" "}
                  {formatRelativeTime(item.createdAt, now)}
                </Text>
              )}
              <View style={[styles.bubble, styles.bubbleOther, { backgroundColor: lightColors.white }]}>
                <Text style={[styles.messageTextOther, { color: lightColors.textTitle }]}>
                  {item.decryptedText}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.messageRowMine}>
            <View style={styles.myMessageBlock}>
              {item.createdAt && item.status !== "Failed" && (
                <Text style={[styles.myTimeText, { color: lightColors.textHint }]}>
                  {formatRelativeTime(item.createdAt, now)}
                </Text>
              )}
              <View
                style={[
                  styles.bubble,
                  styles.bubbleMine,
                  { backgroundColor: lightColors.primary },
                  item.status === "Failed" && styles.bubbleFailed,
                ]}
              >
                <TouchableOpacity
                  style={styles.messageMenuBtn}
                  onPress={() => {
                    setDeleteMenuVisible(true);
                    setDeletingMessageId(item.messageIdDec || null);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="ellipsis-horizontal" size={12} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.messageTextMine}>{item.decryptedText}</Text>
                <View style={styles.statusIconContainer}>
                  {mapStatusIcon(item.status)}
                </View>
              </View>
            </View>
          </View>
        )}
      </>
    );

    if (isNew) {
      return (
        <AnimatedReanimated.View key={msgId} entering={FadeIn.duration(400)}>
          {bubbleContent}
        </AnimatedReanimated.View>
      );
    }

    return <View key={msgId}>{bubbleContent}</View>;
  }, [selectedChat, animatingMsgId, now, setDeleteMenuVisible, setDeletingMessageId]);

  if (isGetMessagesLoading && page === 1) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: lightColors.bgLight }]}>
        <ChatSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: lightColors.bgLight }]} edges={["top", "bottom"]}>
      <View style={[styles.header, { borderBottomColor: lightColors.separator }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(22)} color={lightColors.textTitle} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          {brandImage ? (
            <Image source={{ uri: brandImage }} style={styles.headerAvatarImage} />
          ) : (
            <View style={[styles.headerAvatarPlaceholder, { backgroundColor: stringToColor(brandName) }]}>
              <Text style={styles.headerAvatarInitials}>{brandName?.[0] || "?"}</Text>
            </View>
          )}
          <View>
            <Text style={[styles.headerTitle, { color: lightColors.textTitle }]} numberOfLines={1}>
              {brandName}
            </Text>
            <Text style={[styles.headerStatus, { color: lightColors.textSuccess }]}>Online</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={deleteMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setDeleteMenuVisible(false)}
        >
          <View style={[styles.menuModal, { backgroundColor: lightColors.white }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (deletingMessageId) handleDeleteMessage(deletingMessageId);
              }}
            >
              {deletingMessageId && (
                <ActivityIndicator size="small" color={lightColors.textDanger} style={styles.deleteLoader} />
              )}
              <Text style={[styles.menuItemTextDanger, { color: lightColors.textDanger }]}>
                {deletingMessageId ? "Deleting..." : "Delete Message"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.flex}>
          <FlatList
            style={styles.flex}
            ref={flatListRef}
            data={chatMsgList}
            renderItem={renderMessage}
            keyExtractor={(item: any, index: number) =>
              item.messageIdDec || item.messageIdEncr || item.id || index.toString()
            }
            contentContainerStyle={styles.messagesList}
            onScroll={handleScroll}
            onContentSizeChange={() => {
              const list = chatMsgList;
              if (list && list.length > 0) {
                scrollToEnd(false);
              }
            }}
            scrollEventThrottle={100}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            maxToRenderPerBatch={15}
            windowSize={11}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="chatbubble-outline" size={s(36)} color={lightColors.textInactive} />
                </View>
                <Text style={[styles.emptyTitle, { color: lightColors.textSubtitle }]}>
                  No messages yet.
                </Text>
                <Text style={[styles.emptyDesc, { color: lightColors.textHint }]}>
                  Send a message to start the conversation.
                </Text>
              </View>
            }
            ListHeaderComponent={
              isGetMessagesFetching && page > 1 ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="small" color={lightColors.primary} />
                </View>
              ) : null
            }
          />

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: lightColors.white,
                borderTopColor: lightColors.separator,
                paddingBottom: insets.bottom + vs(6),
              },
            ]}
          >
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: lightColors.bgLight,
                  borderColor: isInputFocused ? lightColors.primary : lightColors.separator,
                },
              ]}
            >
              <TextInput
                style={[styles.textInput, { color: lightColors.textTitle }]}
                placeholder="Type a message..."
                placeholderTextColor={lightColors.textHint}
                value={inputText}
                onChangeText={setInputText}
                multiline
                returnKeyType="send"
                onSubmitEditing={handleSend}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </View>
            <Animated.View style={{ transform: [{ scale: sendBtnScale }] }}>
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  { backgroundColor: inputText.trim().length > 0 ? lightColors.primary : lightColors.bgHeavy },
                ]}
                onPress={handleSend}
                onPressIn={handleSendPressIn}
                onPressOut={handleSendPressOut}
                disabled={inputText.trim().length === 0}
                activeOpacity={0.7}
              >
                <Ionicons name="send" size={s(18)} color="#FFF" style={styles.sendIcon} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
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
    marginEnd: scale(4),
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  headerTitle: {
    fontSize: s(16),
    fontWeight: "600",
    flex: 1,
  },
  headerStatus: {
    fontSize: s(11),
    fontWeight: "500",
    marginTop: 1,
  },
  headerAvatarImage: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
  },
  headerAvatarPlaceholder: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarInitials: {
    color: "#FFF",
    fontSize: s(13),
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuModal: {
    borderRadius: scale(14),
    paddingVertical: vs(8),
    paddingHorizontal: s(8),
    minWidth: s(200),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    gap: scale(10),
  },
  menuItemTextDanger: {
    fontSize: s(15),
    fontWeight: "500",
  },
  deleteLoader: {
    marginEnd: scale(4),
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
  messagesList: {
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    paddingBottom: vs(4),
  },
  messageRowOther: {
    marginBottom: vs(14),
    flexDirection: "row",
    alignItems: "flex-end",
    gap: scale(8),
  },
  messageRowMine: {
    marginBottom: vs(14),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  otherAvatar: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    overflow: "hidden",
  },
  otherAvatarImage: {
    width: "100%",
    height: "100%",
  },
  otherAvatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  otherAvatarInitials: {
    color: "#FFF",
    fontSize: s(12),
    fontWeight: "600",
  },
  otherMessageBlock: {
    flex: 1,
    maxWidth: "78%",
  },
  myMessageBlock: {
    alignItems: "flex-end",
    maxWidth: "78%",
  },
  senderNameTime: {
    fontSize: s(11),
    marginBottom: vs(4),
    marginStart: s(4),
  },
  myTimeText: {
    fontSize: s(11),
    marginBottom: vs(4),
    marginEnd: s(4),
  },
  bubble: {
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    borderRadius: 20,
    position: "relative",
  },
  bubbleOther: {
    borderBottomStartRadius: 4,
  },
  bubbleMine: {
    borderBottomEndRadius: 4,
  },
  bubbleFailed: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  messageTextOther: {
    fontSize: s(15),
    lineHeight: s(21),
  },
  messageTextMine: {
    fontSize: s(15),
    lineHeight: s(21),
    color: "#FFF",
  },
  messageMenuBtn: {
    position: "absolute",
    top: -2,
    end: 2,
    padding: 6,
    zIndex: 10,
  },
  statusIconContainer: {
    position: "absolute",
    bottom: -7,
    end: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: s(12),
    paddingTop: vs(10),
    paddingBottom: vs(8),
    borderTopWidth: 1,
    gap: scale(8),
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: s(4),
    paddingVertical: vs(2),
  },
  textInput: {
    fontSize: s(15),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    maxHeight: vs(100),
  },
  sendBtn: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(2),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sendIcon: {
    marginStart: 2,
  },
  loadingMore: {
    paddingVertical: vs(10),
    alignItems: "center",
  },
});
