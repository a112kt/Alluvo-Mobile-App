import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Alert } from "react-native";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import {
  RoomType,
  MessageType,
  DecryptedMessageType,
  ChatBootMessageType,
} from "../services/chat";
import { encrypt, decrypt, getCurrentUserId } from "../../../utils/chatHelpers";
import { showToast } from "../../../services/toastService";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetMessages,
  useSendMessage,
  useMarkAsRead,
  useUnreadCount,
  useDeleteChat,
  useDeleteMessage,
  useChatBootMessaging,
  CHAT_ROOMS_QUERY_KEY,
} from "../hooks/useChat";

type ChatContextType = {
  connection: signalR.HubConnection | null;
  chatSearch: string;
  setChatSearch: (search: string) => void;
  selectedChat: RoomType | null;
  setSelectedChat: (chat: RoomType | null) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  setEncryptedChatId: (id: string | null) => void;
  encryptedChatId: string | null;
  sendMessage: (msg: string) => void;
  chatMsgList: DecryptedMessageType[];
  isGetMessagesLoading: boolean;
  isGetMessagesFetching: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasNextPage: boolean;
  userId: string | null;
  isSendMessagePending: boolean;
  roomUpdatedReadCount: { roomIdDec: string | null; count: number } | null;
  deleteChat: (roomIdEnc: string) => Promise<void>;
  isDeleteChatSuccess: boolean;
  fetchLockRef: React.MutableRefObject<boolean>;
  goToBottom: boolean;
  setGoToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  setChatMsgList: React.Dispatch<React.SetStateAction<DecryptedMessageType[]>>;
  isChatBoot: boolean;
  setIsChatBoot: React.Dispatch<React.SetStateAction<boolean>>;
  sendQueryToChatBoot: (query: string) => void;
  chatBootMessages: ChatBootMessageType[];
  setChatBootMessages: React.Dispatch<
    React.SetStateAction<ChatBootMessageType[]>
  >;
  isSendQueryPending: boolean;
  isSendQuerySuccess: boolean;
};

export const ChatContext = createContext<ChatContextType>({
  connection: null,
  chatSearch: "",
  setChatSearch: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  activeChatId: null,
  setActiveChatId: () => {},
  sendMessage: () => {},
  chatMsgList: [],
  isGetMessagesLoading: false,
  isGetMessagesFetching: false,
  page: 1,
  setPage: () => {},
  hasNextPage: false,
  userId: null,
  setEncryptedChatId: () => {},
  encryptedChatId: null,
  isSendMessagePending: false,
  roomUpdatedReadCount: null,
  deleteChat: () => Promise.resolve(),
  isDeleteChatSuccess: false,
  fetchLockRef: { current: false },
  goToBottom: false,
  setGoToBottom: () => {},
  setChatMsgList: () => {},
  isChatBoot: false,
  setIsChatBoot: () => {},
  sendQueryToChatBoot: () => {},
  chatBootMessages: [],
  setChatBootMessages: () => {},
  isSendQueryPending: false,
  isSendQuerySuccess: false,
});

export const ChatProvider = ({
  children,
  baseApiUrl,
}: {
  children: React.ReactNode;
  baseApiUrl?: string;
}) => {
  const [goToBottom, setGoToBottom] = useState(false);
  const queryClient = useQueryClient();
  const {
    mutate: sendMessageMutate,
    isPending: isSendMessagePending,
  } = useSendMessage();
  const { mutate: markAsReadMutate } = useMarkAsRead();

  const [unReadCountRoomId, setUnreadCountRoomId] = useState<string | null>(
    null,
  );
  const {
    data: unreadCount,
    isSuccess: isUnreadCountSuccess,
    refetch: unReadCountRefetch,
  } = useUnreadCount(unReadCountRoomId);
  const {
    mutateAsync: deleteChat,
    isSuccess: isDeleteChatSuccess,
  } = useDeleteChat();
  const [chatSearch, setChatSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<RoomType | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [encryptedChatId, setEncryptedChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isChatBoot, setIsChatBoot] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [roomUpdatedReadCount, setRoomUpdatedReadCount] = useState<{
    roomIdDec: string | null;
    count: number;
  } | null>(null);
  const [onGoingMessageQueue, setOnGoingMessageQueue] = useState<
    {
      roomIdEncr: string;
      textEncr: string;
      plainText: string;
      optimisticId: string;
    }[]
  >([]);

  const reduxToken = useSelector((state: RootState) => state.auth.token);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [chatMsgList, setChatMsgList] = useState<DecryptedMessageType[]>([]);
  const fetchLockRef = useRef(false);

  const apiUrl = baseApiUrl || process.env.EXPO_PUBLIC_API_URL;

  const [prevActiveChatId, setPrevActiveChatId] = useState<string | null>(null);
  if (activeChatId !== prevActiveChatId) {
    setPrevActiveChatId(activeChatId);
    setPage(1);
    setChatMsgList([]);
  }

  const {
    data: roomMessages,
    isSuccess,
    isLoading: isGetMessagesLoading,
    isError,
    isFetching: isGetMessagesFetching,
  } = useGetMessages({
    roomIdEncr: encryptedChatId,
    page,
    unreadOnly: false,
  });

  useEffect(() => {
    if (!reduxToken) return;
    const uid = getCurrentUserId(reduxToken);
    setUserId(uid);
  }, [reduxToken]);

  useEffect(() => {
    if (!reduxToken) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/chatHub`, {
        accessTokenFactory: () => reduxToken,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    let cancelled = false;

    const startConnection = async () => {
      try {
        await connection.start();
        if (!cancelled) {
          setConnection(connection);
        }
      } catch (error) {
        console.error("Error starting SignalR connection:", error);
      }
    };
    startConnection();

    return () => {
      cancelled = true;
      connection.stop().catch(() => {});
    };
  }, [reduxToken, apiUrl]);

  useEffect(() => {
    if (!connection) return;

    const onReceiveMessage = async (encryptedMsg: any) => {
      const decryptedRoomId = await decrypt(encryptedMsg?.roomIdEncr);
      const msg = {
        ...encryptedMsg,
        messageIdDec: await decrypt(encryptedMsg?.messageIdEncr),
        decryptedText: await decrypt(encryptedMsg?.textEncr),
      };
      if (decryptedRoomId === activeChatId) {
        setChatMsgList((prev) => [...prev, msg]);
        setGoToBottom(true);
        markAsReadMutate({
          messageIds: [encryptedMsg?.messageIdEncr],
          roomId: selectedChat?.roomIdEnc || "",
          status: "Seen",
        });
      } else {
        setUnreadCountRoomId(encryptedMsg.roomIdEncr);
        unReadCountRefetch();
        queryClient.invalidateQueries({
          queryKey: CHAT_ROOMS_QUERY_KEY,
        });
        markAsReadMutate({
          messageIds: [encryptedMsg?.messageIdEncr],
          roomId: encryptedMsg?.roomIdEncr || "",
          status: "Delivered",
        });
        showToast(
          "New Message",
          msg.decryptedText.substring(0, 60),
          undefined,
          "info",
        );
      }
    };

    const MarkMessagesAs = (messageIds: string[], status = "Seen") => {
      if (
        !messageIds ||
        !Array.isArray(messageIds) ||
        messageIds.length === 0
      )
        return;
      setChatMsgList((prev) =>
        prev.map((msg) => {
          if (messageIds.includes(msg?.messageIdDec || "")) {
            return { ...msg, status };
          }
          return msg;
        }),
      );
    };

    connection.on("OnReceiveMessage", onReceiveMessage);
    connection.on("OnMessageSeen", (messageIds) => {
      MarkMessagesAs(messageIds);
    });

    return () => {
      connection.off("OnReceiveMessage", onReceiveMessage);
      connection.off("OnMessageSeen", MarkMessagesAs);
    };
  }, [connection, activeChatId, selectedChat]);

  useEffect(() => {
    if (isSuccess && roomMessages?.data?.data && userId) {
      const messages: MessageType[] = roomMessages.data.data;
      setHasNextPage(roomMessages.data?.meta?.hasNextPage);

      Promise.all(
        messages.map(async (msg) => ({
          ...msg,
          messageIdDec: await decrypt(msg.messageIdEncr),
          decryptedText: await decrypt(msg.textEncr),
          isMyMessage: (await decrypt(msg.senderIdEncr)) === userId,
          createdAt: msg.createdAt + "Z",
        })),
      )
        .then((decrypted) => {
          setChatMsgList((prev) => {
            const newMessages = decrypted.filter(
              (d) => !prev.some((p) => p.messageIdDec === d.messageIdDec),
            );
            const combined = [...prev, ...newMessages];
            return combined.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            );
          });
          const unreadMessageIds = decrypted
            .filter((msg) => !msg.isMyMessage && msg.status !== "Seen")
            .map((msg) => msg.messageIdEncr);
          if (unreadMessageIds.length > 0) {
            markAsReadMutate({
              messageIds: unreadMessageIds,
              roomId: selectedChat?.roomIdEnc || "",
              status: "Seen",
            });
          }
        })
        .finally(() => {
          fetchLockRef.current = false;
        });
    }
    if (isError) {
      fetchLockRef.current = false;
    }
  }, [isSuccess, isError, roomMessages, userId]);

  useEffect(() => {
    if (!selectedChat) {
      setActiveChatId(null);
      setEncryptedChatId(null);
    } else {
      setIsChatBoot(false);
      setActiveChatId(selectedChat?.roomIdDec);
      setEncryptedChatId(selectedChat?.roomIdEnc);
      setRoomUpdatedReadCount({
        roomIdDec: selectedChat?.roomIdDec,
        count: 0,
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    if (isChatBoot) {
      setSelectedChat(null);
    }
  }, [isChatBoot]);

  useEffect(() => {
    async function updateRoomUpdatedReadCount() {
      if (!unReadCountRoomId) return;
      const roomId = await decrypt(unReadCountRoomId);
      setRoomUpdatedReadCount({
        roomIdDec: roomId,
        count: unreadCount?.data,
      });
    }
    if (isUnreadCountSuccess && unreadCount) {
      updateRoomUpdatedReadCount();
    }
  }, [isUnreadCountSuccess, unreadCount, unReadCountRoomId]);

  const [chatBootMessages, setChatBootMessages] = useState<
    ChatBootMessageType[]
  >([]);
  const {
    mutate: sendQuery,
    data: chatBootResponse,
    isPending: isSendQueryPending,
    isSuccess: isSendQuerySuccess,
  } = useChatBootMessaging();

  const sendQueryToChatBoot = useCallback(
    (query: string) => {
      setChatBootMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2),
          text: query,
          isQuery: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      setGoToBottom(true);
      sendQuery(query);
    },
    [sendQuery],
  );

  useEffect(() => {
    if (isSendQuerySuccess && chatBootResponse) {
      setChatBootMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2),
          text: chatBootResponse.answer,
          isQuery: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setGoToBottom(true);
    }
  }, [isSendQuerySuccess, chatBootResponse]);

  const sendMessage = async (message: string) => {
    try {
      const textEncr = encrypt(message);
      if (!selectedChat) {
        console.error("sendMessage failed: selectedChat is null");
        Alert.alert("Error", "No chat selected. Please try again.");
        return;
      }
      const roomIdEncr = selectedChat?.roomIdEnc;
      if (!roomIdEncr) {
        console.error("sendMessage failed: roomIdEnc is null/undefined on selectedChat", selectedChat);
        Alert.alert("Error", "Invalid chat room. Please try again.");
        return;
      }
      setOnGoingMessageQueue((prev) => [
        ...prev,
        {
          textEncr,
          roomIdEncr,
          plainText: message,
          optimisticId: Math.random().toString(36).substring(2),
        },
      ]);
    } catch (err) {
      console.error("sendMessage failed with exception:", err);
      Alert.alert("Error", "Message could not be sent. Please try again.");
    }
  };

  useEffect(() => {
    if (onGoingMessageQueue.length === 0 || isSendMessagePending) {
      return;
    }

    const nextMessage = onGoingMessageQueue[0];

    const optimisticMessage: DecryptedMessageType = {
      createdAt: new Date().toISOString(),
      messageIdDec: nextMessage.optimisticId,
      textEncr: nextMessage.textEncr,
      messageIdEncr: "",
      decryptedText: nextMessage.plainText,
      isMyMessage: true,
      status: "Pending",
      roomIdEncr: selectedChat?.roomIdEnc || "",
      senderIdEncr: userId || "",
      imageUrlEncr: null,
    };

    setChatMsgList((prev) => {
      const exists = prev.some(
        (m) => m.messageIdDec === nextMessage.optimisticId,
      );
      if (exists) return prev;
      return [...prev, optimisticMessage];
    });
    setGoToBottom(true);

    sendMessageMutate(nextMessage, {
      onSuccess: async (responseData) => {
        setOnGoingMessageQueue((prev) => prev.slice(1));
        if (responseData?.data) {
          try {
            const decMessageId = await decrypt(responseData.data.messageIdEncr);
            const decText = await decrypt(responseData.data.textEncr);
            const isMy = (await decrypt(responseData.data.senderIdEncr)) === userId;
            const myNewMessage: DecryptedMessageType = {
              ...responseData.data,
              messageIdDec: decMessageId,
              decryptedText: decText,
              isMyMessage: isMy,
            };
            setChatMsgList((prev) =>
              prev.map((m) => {
                if (m.messageIdDec === nextMessage.optimisticId) {
                  return myNewMessage;
                }
                return m;
              }),
            );
          } catch (err) {
            console.error("Failed to decrypt success response:", err);
          }
        }
      },
      onError: (err) => {
        console.error("Mutation send message error callback:", err);
        setOnGoingMessageQueue((prev) => prev.slice(1));
        setChatMsgList((prev) =>
          prev.map((m) => {
            if (m.messageIdDec === nextMessage.optimisticId) {
              return { ...m, status: "Failed" };
            }
            return m;
          }),
        );
      },
    });
  }, [onGoingMessageQueue, isSendMessagePending, userId, selectedChat]);


  const contextValue = useMemo(
    () => ({
      connection,
      chatSearch,
      setChatSearch,
      selectedChat,
      setSelectedChat,
      activeChatId,
      setActiveChatId,
      sendMessage,
      chatMsgList,
      setChatMsgList,
      page,
      setPage,
      userId,
      hasNextPage,
      setEncryptedChatId,
      encryptedChatId,
      isSendMessagePending,
      roomUpdatedReadCount,
      deleteChat,
      isDeleteChatSuccess,
      isGetMessagesLoading,
      isGetMessagesFetching,
      fetchLockRef,
      goToBottom,
      setGoToBottom,
      isChatBoot,
      setIsChatBoot,
      sendQueryToChatBoot,
      chatBootMessages,
      setChatBootMessages,
      isSendQueryPending,
      isSendQuerySuccess,
    }),
    [
      connection,
      chatSearch,
      selectedChat,
      activeChatId,
      sendMessage,
      chatMsgList,
      page,
      userId,
      hasNextPage,
      encryptedChatId,
      isSendMessagePending,
      roomUpdatedReadCount,
      deleteChat,
      isDeleteChatSuccess,
      isGetMessagesLoading,
      isGetMessagesFetching,
      fetchLockRef,
      goToBottom,
      isChatBoot,
      sendQueryToChatBoot,
      chatBootMessages,
      isSendQueryPending,
      isSendQuerySuccess,
    ],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
