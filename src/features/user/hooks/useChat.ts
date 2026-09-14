import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoomList,
  getRoomMessages,
  sendMessgae,
  markAsRead,
  getUnReadCount,
  DeleteChat,
  createNewChat,
  DeleteMessage,
  ChatBootMessaging,
  createRoom,
  CreateRoomPayload,
} from "../services/chat";
import { decrypt } from "../../../utils/chatHelpers";

export const CHAT_ROOMS_QUERY_KEY = ["roomList"];

export function useRoomList() {
  return useQuery({
    queryKey: CHAT_ROOMS_QUERY_KEY,
    queryFn: async () => {
      const res = await getRoomList();
      if (res && Array.isArray(res.data)) {
        const decryptedRooms = await Promise.all(
          res.data.map(async (room: any) => {
            const roomIdDec = await decrypt(room.roomIdEnc);
            return { ...room, roomIdDec };
          }),
        );
        return { ...res, data: decryptedRooms };
      }
      return res;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetMessages(data: {
  roomIdEncr: string | null;
  page: number;
  unreadOnly?: boolean;
  afterMessageId?: string;
}) {
  return useQuery({
    queryKey: ["messages", data.roomIdEncr, data.page],
    queryFn: () => getRoomMessages(data),
    enabled: !!data.roomIdEncr,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: (message: { roomIdEncr: string; textEncr: string }) =>
      sendMessgae(message),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      messageIds: string[];
      roomId: string;
      status: string;
    }) => markAsRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_QUERY_KEY });
    },
  });
}

export function useUnreadCount(roomIdEncr: string | null) {
  return useQuery({
    queryKey: ["unreadCount", roomIdEncr],
    queryFn: () => getUnReadCount(roomIdEncr || ""),
    enabled: !!roomIdEncr,
  });
}

export function useDeleteChat() {
  return useMutation({
    mutationFn: (roomIdEnc: string) => DeleteChat(roomIdEnc),
  });
}

export function useCreateNewChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => createNewChat(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_QUERY_KEY });
    },
  });
}

export function useDeleteMessage() {
  return useMutation({
    mutationFn: (messageIdEncr: string) => DeleteMessage(messageIdEncr),
  });
}

export function useChatBootMessaging() {
  return useMutation({
    mutationFn: (query: string) => ChatBootMessaging(query),
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => createRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_QUERY_KEY });
    },
  });
}

// Backward-compatible aliases for existing imports
export const useChatRooms = useRoomList;
