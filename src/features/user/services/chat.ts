import { apiCall } from "../../../../services/apiClient";
import axios from "axios";
import { CHATBOT_BASE_URL } from "../../../../src/config/env";

const chatBootUrl = CHATBOT_BASE_URL;

export type RoomType = {
  roomIdEnc: string;
  roomIdDec: string;
  userName: string;
  userImageUrl: string;
  unreadCount: number;
};

export type MessageType = {
  messageIdEncr: string;
  roomIdEncr: string;
  senderIdEncr: string;
  textEncr: string;
  imageUrlEncr: string | null;
  status: string;
  createdAt: string;
};

export type DecryptedMessageType = MessageType & {
  decryptedText: string;
  messageIdDec?: string;
  isMyMessage: boolean;
};

export type ChatBootMessageType = {
  id: string;
  text: string;
  isQuery: boolean;
  createdAt: string;
};

export type AlluvoApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: { en: string; ar: string };
  data: T;
  errors: any[];
};

export async function getRoomList(): Promise<
  AlluvoApiResponse<RoomType[]>
> {
  const res = await apiCall.get("api/Chat/rooms");
  return res.data;
}

export async function getRoomMessages(data: {
  roomIdEncr: string | null;
  page: number;
  unreadOnly?: boolean;
  afterMessageId?: string;
}) {
  const { roomIdEncr, page, unreadOnly } = data;
  const res = await apiCall.get(
    `api/Chat/rooms/${encodeURIComponent(roomIdEncr || "")}/messages`,
    {
      params: {
        page,
        unreadOnly: unreadOnly || undefined,
        pageSize: 30,
      },
    },
  );
  return res.data;
}

export async function sendMessgae(data: {
  roomIdEncr: string;
  textEncr: string;
}) {
  const res = await apiCall.post("api/Chat/message", data);
  return res.data;
}

export async function markAsRead(data: {
  messageIds: string[];
  roomId: string;
  status: string;
}) {
  const res = await apiCall.post("api/Chat/status", data);
  return res.data;
}

export async function getUnReadCount(roomIdEncr: string) {
  const res = await apiCall.get(
    "api/Chat/rooms/unreadCount/" + encodeURIComponent(roomIdEncr || ""),
  );
  return res.data;
}

export async function DeleteChat(roomIdEnc: string) {
  const res = await apiCall.delete(
    `api/Chat/room/${encodeURIComponent(roomIdEnc)}`,
  );
  return res.data;
}

export async function createNewChat(userId: string) {
  const res = await apiCall.post(`api/Chat/room/test?userId=${userId}`);
  return res.data;
}

export interface CreateRoomPayload {
  brandId: number;
  productId?: number;
}

export async function createRoom(payload: CreateRoomPayload) {
  const res = await apiCall.post("api/Chat/room", payload);
  return res.data;
}

export async function getBrandOwner(brandId: number) {
  const res = await apiCall.get(`api/BrandOwner/${brandId}`);
  return res.data;
}

export async function DeleteMessage(messageIdEncr: string) {
  const res = await apiCall.delete(
    `api/Chat/message/${encodeURIComponent(messageIdEncr)}`,
  );
  return res.data;
}

export async function ChatBootMessaging(query: string) {
  const res = await axios.post(
    "/api/chat",
    { query },
    { baseURL: chatBootUrl },
  );
  return res.data;
}
