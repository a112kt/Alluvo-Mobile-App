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
  Modal,
  Pressable,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { scale, vs, ms, s } from "react-native-size-matters";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../Navigation/types";
import { backarrow } from "../../../assests/icons/AllIcon";
import { ChatContext } from "../chatContext/ChatContext";
import { DecryptedMessageType, ChatBootMessageType } from "../services/chat";
import { useDeleteMessage } from "../hooks/useChat";
import {
  PendingIcon,
  CheckedIcon2,
  DoubleCheckedIcon,
} from "../../../iconComponent/MessageStatusIcons";
import { decrypt } from "../../../utils/chatHelpers";
import { lightColors } from "../../../../theme";
import AnimatedReanimated, { FadeIn } from "react-native-reanimated";

type ChatMessagesRouteProp = RouteProp<UserStackParamList, "ChatMessages">;

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

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const d = new Date(timeStr);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  if (isToday) return `${hours}:${mins}`;
  return `${d.getDate()}/${d.getMonth() + 1} ${hours}:${mins}`;
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

export default function ChatMessagesScreen() {
  const navigation = useNavigation();
  const route = useRoute<ChatMessagesRouteProp>();
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
    isChatBoot,
    setIsChatBoot,
    sendQueryToChatBoot,
    chatBootMessages,
    isSendQueryPending,
    connection,
    deleteChat,
    isDeleteChatSuccess,
    encryptedChatId,
  } = useContext(ChatContext);

  const { mutate: deleteMessageMutate } = useDeleteMessage();

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
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
    if (roomIdEncr && brandName !== "Alluvo AI") {
      if (!selectedChat || selectedChat.roomIdEnc !== roomIdEncr) {
        const decryptedRoomId = decrypt(roomIdEncr);
        setSelectedChat({
          roomIdEnc: roomIdEncr,
          roomIdDec: decryptedRoomId || roomIdEncr,
          userName: brandName,
          userImageUrl: brandImage || "",
          unreadCount: 0,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomIdEncr, brandName, brandImage]);

  useEffect(() => {
    return () => {
      setSelectedChat(null);
      setChatMsgList([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToEnd = useCallback((animated = true) => {
    const list = messages;
    if (flatListRef.current && list && list.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated });
      }, 50);
    }
  }, [messages ? messages.length : 0]);

  useEffect(() => {
    const list = messages;
    if (list && list.length > 0 && page === 1) {
      scrollToEnd(false);
    }
  }, [messages ? messages.length : 0, page]);

  useEffect(() => {
    const list = messages;
    if (goToBottom && list && list.length > 0) {
      scrollToEnd(true);
      const lastMsg: any = list[list.length - 1];
      const id = lastMsg?.messageIdDec || lastMsg?.id || `msg-${list.length}`;
      setAnimatingMsgId(id);
      const timer = setTimeout(() => setAnimatingMsgId(null), 600);
      setGoToBottom(false);
      return () => clearTimeout(timer);
    }
  }, [goToBottom, messages ? messages.length : 0, scrollToEnd, setGoToBottom]);

  const handleScroll = useCallback(
    (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      if (
        offsetY < 50 &&
        hasNextPage &&
        !isGetMessagesFetching &&
        !fetchLockRef.current
      ) {
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
        setChatMsgList((prev) =>
          prev.filter((m) => m.messageIdDec !== messageIdDec),
        );
        setDeletingMessageId(null);
        setDeleteMenuVisible(false);
      },
      onError: () => {
        setDeletingMessageId(null);
      },
    });
  }, [deleteMessageMutate, setChatMsgList]);

  const handleDeleteChat = useCallback(() => {
    Alert.alert("Delete Chat", "Delete this conversation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (selectedChat) {
            deleteChat(selectedChat.roomIdEnc).then(() => {
              navigation.goBack();
            });
          }
        },
      },
    ]);
  }, [selectedChat, deleteChat, navigation]);

  const handleSend = useCallback(() => {
    Keyboard.dismiss();
    const text = inputText.trim();
    if (!text) return;
    if (isChatBoot) {
      sendQueryToChatBoot(text);
    } else {
      sendMessage(text);
    }
    setInputText("");
  }, [inputText, isChatBoot, sendQueryToChatBoot, sendMessage]);

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

  const renderChatBotMessage = useCallback((item: ChatBootMessageType, index: number) => {
    const isMine = item.isQuery;
    return (
      <AnimatedReanimated.View
        key={item.id || index.toString()}
        entering={FadeIn.duration(300)}
      >
        {!isMine ? (
          <View style={styles.messageRowOther}>
            <View style={styles.otherAvatarSmall}>
              <Ionicons name="sparkles" size={16} color="#FFF" />
            </View>
            <View style={styles.otherMessageBlock}>
              {item.createdAt && (
                <Text style={[styles.senderNameTime, { color: lightColors.hint }]}>
                  Alluvo AI, {formatRelativeTime(item.createdAt, now)}
                </Text>
              )}
              <View style={[styles.bubble, styles.bubbleOther, { backgroundColor: lightColors.bgLight }]}>
                <Text style={[styles.messageTextOther, { color: lightColors.title }]}>
                  {item.text}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.messageRowMine}>
            <View style={styles.myMessageBlock}>
              {item.createdAt && (
                <Text style={[styles.myTimeText, { color: lightColors.hint }]}>
                  {formatRelativeTime(item.createdAt, now)}
                </Text>
              )}
              <View style={[styles.bubble, styles.bubbleMine, { backgroundColor: lightColors.primary }]}>
                <Text style={styles.messageTextMine}>{item.text}</Text>
              </View>
            </View>
          </View>
        )}
      </AnimatedReanimated.View>
    );
  }, [now]);

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
                <Image
                  source={{ uri: selectedChat.userImageUrl }}
                  style={styles.otherAvatarImage}
                />
              ) : (
                <View style={[styles.otherAvatarPlaceholder, { backgroundColor: lightColors.primary }]}>
                  <Text style={styles.otherAvatarInitials}>
                    {selectedChat?.userName?.[0] || "?"}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.otherMessageBlock}>
              {item.createdAt && (
                <Text style={[styles.senderNameTime, { color: lightColors.hint }]}>
                  {selectedChat?.userName},{" "}
                  {formatRelativeTime(item.createdAt, now)}
                </Text>
              )}
              <View style={[styles.bubble, styles.bubbleOther, { backgroundColor: lightColors.bgLight }]}>
                <Text style={[styles.messageTextOther, { color: lightColors.title }]}>
                  {item.decryptedText}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.messageRowMine}>
            <View style={styles.myMessageBlock}>
              {item.createdAt && item.status !== "Failed" && (
                <Text style={[styles.myTimeText, { color: lightColors.hint }]}>
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
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={12}
                    color="#FFF"
                  />
                </TouchableOpacity>
                <Text style={styles.messageTextMine}>
                  {item.decryptedText}
                </Text>
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
        <AnimatedReanimated.View
          key={msgId}
          entering={FadeIn.duration(400)}
        >
          {bubbleContent}
        </AnimatedReanimated.View>
      );
    }

    return (
      <View key={msgId}>
        {bubbleContent}
      </View>
    );
  }, [selectedChat, animatingMsgId, now, setDeleteMenuVisible, setDeletingMessageId]);

  const messages = (isChatBoot ? chatBootMessages : chatMsgList) || [];

  if (isGetMessagesLoading && page === 1 && !isChatBoot) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: lightColors.bgLight }]}>
        <Header
          brandName={brandName}
          onBack={() => navigation.goBack()}
          onMenu={() => setMenuVisible(true)}
          showBack
          colors={lightColors}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={lightColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: lightColors.bgLight }]} edges={["top", "bottom"]}>
      <View style={[styles.header, { borderBottomColor: lightColors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <SvgXml xml={backarrow} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          {isChatBoot ? (
            <View style={styles.headerAvatar}>
              <Ionicons name="sparkles" size={20} color="#FFF" />
            </View>
          ) : (selectedChat?.userImageUrl || brandImage) ? (
            <Image
              source={{ uri: selectedChat?.userImageUrl || brandImage }}
              style={styles.headerAvatarImage}
            />
          ) : (
            <View style={[styles.headerAvatarPlaceholder, { backgroundColor: lightColors.primary }]}>
              <Text style={styles.headerAvatarInitials}>
                {selectedChat?.userName?.[0] || brandName?.[0] || "?"}
              </Text>
            </View>
          )}
          <Text style={[styles.headerTitle, { color: lightColors.title }]} numberOfLines={1}>
            {isChatBoot ? "Alluvo AI" : (selectedChat?.userName || brandName)}
          </Text>
        </View>

        {!isChatBoot && (
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={handleDeleteChat}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={20} color={lightColors.textDanger} />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuModal, { backgroundColor: lightColors.white }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                handleDeleteChat();
              }}
            >
              <Ionicons name="trash-outline" size={18} color={lightColors.textDanger} />
              <Text style={[styles.menuItemTextDanger, { color: lightColors.textDanger }]}>Delete Chat</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={deleteMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDeleteMenuVisible(false)}
        >
          <View style={[styles.menuModal, { backgroundColor: lightColors.white }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (deletingMessageId) {
                  handleDeleteMessage(deletingMessageId);
                }
              }}
            >
              {deletingMessageId && (
                <ActivityIndicator
                  size="small"
                  color={lightColors.textDanger}
                  style={styles.deleteLoader}
                />
              )}
              <Text style={[styles.menuItemTextDanger, { color: lightColors.textDanger }]}>
                {deletingMessageId ? "Deleting..." : "Delete Message"}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.flex}>
        {isChatBoot && chatBootMessages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeIcon}>
              <Ionicons
                name="bag-outline"
                size={40}
                color={lightColors.primary}
              />
            </View>
            <Text style={[styles.welcomeTitle, { color: lightColors.title }]}>
              Welcome to Shop Assistant
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: lightColors.subtitle }]}>
              Looking for something today?
            </Text>
            <Text style={[styles.welcomeDesc, { color: lightColors.hint }]}>
              Ask me about products, prices, recommendations, or order
              information.
            </Text>
          </View>
        ) : (
          <FlatList
            style={styles.flex}
            ref={flatListRef}
            data={messages}
            renderItem={
              isChatBoot
                ? ({ item, index }) =>
                    renderChatBotMessage(
                      item as ChatBootMessageType,
                      index,
                    )
                : renderMessage
            }
            keyExtractor={(item: any, index) =>
              item.messageIdDec ||
              item.messageIdEncr ||
              item.id ||
              index.toString()
            }
            contentContainerStyle={styles.messagesList}
            onScroll={!isChatBoot ? handleScroll : undefined}
            onContentSizeChange={() => {
              const list = messages;
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
              !isChatBoot ? (
                <View style={styles.centerContainer}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={48}
                    color={lightColors.hint}
                  />
                  <Text style={[styles.emptyText, { color: lightColors.hint }]}>
                    No messages yet
                  </Text>
                </View>
              ) : null
            }
            ListHeaderComponent={
              !isChatBoot && isGetMessagesFetching && page > 1 ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="small" color={lightColors.primary} />
                </View>
              ) : null
            }
          />
        )}

        {isChatBoot && isSendQueryPending && (
          <View style={styles.typingIndicator}>
            <View style={styles.otherAvatarSmall}>
              <Ionicons name="sparkles" size={16} color="#FFF" />
            </View>
            <ActivityIndicator size="small" color={lightColors.primary} />
          </View>
        )}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: lightColors.white,
              borderTopColor: lightColors.border,
              paddingBottom: insets.bottom + vs(8),
            },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: lightColors.bgLight,
                borderColor: isInputFocused ? lightColors.primary : lightColors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: lightColors.title }]}
              placeholder={isChatBoot ? "Ask me anything..." : "Type a Message"}
              placeholderTextColor={lightColors.hint}
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
                { backgroundColor: lightColors.primary },
              ]}
              onPress={handleSend}
              onPressIn={handleSendPressIn}
              onPressOut={handleSendPressOut}
              disabled={inputText.trim().length === 0}
              activeOpacity={0.7}
            >
              <Ionicons
                name="send"
                size={18}
                color="#FFF"
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({
  brandName,
  onBack,
  onMenu,
  showBack,
  colors,
}: {
  brandName: string;
  onBack: () => void;
  onMenu: () => void;
  showBack?: boolean;
  colors: any;
}) {
  return (
    <View style={[styles.header, { borderBottomColor: lightColors.border }]}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <SvgXml xml={backarrow} />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, { color: lightColors.title }]} numberOfLines={1}>
        {brandName}
      </Text>
      <TouchableOpacity style={styles.menuBtn} onPress={onMenu}>
        <Ionicons name="ellipsis-vertical" size={20} color={lightColors.title} />
      </TouchableOpacity>
    </View>
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
    fontSize: ms(16),
    fontWeight: "600",
    flex: 1,
  },
  headerAvatar: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: "#47C0D2",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: ms(13),
    fontWeight: "600",
  },
  menuBtn: {
    padding: scale(8),
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
    fontSize: ms(15),
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
  emptyText: {
    fontSize: ms(14),
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
    fontSize: ms(12),
    fontWeight: "600",
  },
  otherAvatarSmall: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: "#47C0D2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(2),
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
    fontSize: ms(11),
    marginBottom: vs(4),
    marginStart: s(4),
  },
  myTimeText: {
    fontSize: ms(11),
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
    fontSize: ms(15),
    lineHeight: ms(21),
  },
  messageTextMine: {
    fontSize: ms(15),
    lineHeight: ms(21),
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
    fontSize: ms(15),
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
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: s(32),
    backgroundColor: lightColors.bgLight,
  },
  welcomeIcon: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: "rgba(27,35,81,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(16),
  },
  welcomeTitle: {
    fontSize: ms(20),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: vs(8),
  },
  welcomeSubtitle: {
    fontSize: ms(16),
    textAlign: "center",
    marginBottom: vs(4),
  },
  welcomeDesc: {
    fontSize: ms(13),
    textAlign: "center",
    lineHeight: ms(20),
  },
  loadingMore: {
    paddingVertical: vs(10),
    alignItems: "center",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    gap: scale(8),
  },
});
