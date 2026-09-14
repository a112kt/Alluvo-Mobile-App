import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { SvgXml } from "react-native-svg";
import RemoteSvg from "./RemoteSvg";
import { closeIcon, heartSmall } from "../../../assests/icons/AllIcon";
import {
  ReelComment,
  ReelCommentReply,
  getReelComments,
  addComment,
  toggleCommentLike,
  getCommentReplies,
  addReply,
  toggleReplyLike,
} from "../services";
import { useProfile } from "../hooks/UserProfile/useProfile";

const EMOJI_DATA = [
  "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊",
  "😋","😎","😍","🥰","😘","😗","🤔","🤨","😐","😑",
  "😶","🙄","😏","😣","😥","😮","🤐","😯","😴","🤤",
  "😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑",
  "😲","🙁","😖","😞","😟","😤","😢","😭","😦","😧",
  "😨","😩","🤯","😬","😰","😱","🥵","🥶","😳","🤪",
  "👍","👎","👏","🙌","🤝","💪","🔥","❤️","💯","⭐",
  "🎉","🎊","✅","❌","⚡","💡","🙏","💕","😊","🤟",
];

interface Props {
  onClose: () => void;
  reelId: number;
  totalComments: number;
  brandImageUrl?: string;
  onCommentAdded?: () => void;
}

type CommentWithLocal = ReelComment & { localIsLiked: boolean; localLikes: number };
type ReplyWithLocal = ReelCommentReply & { localIsLiked: boolean; localLikes: number };

const CommentsBottomSheet: React.FC<Props> = ({
  onClose,
  reelId,
  totalComments,
  brandImageUrl,
  onCommentAdded,
}) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { data: userProfile } = useProfile();
  const userAvatarUrl = userProfile?.data?.profileImageUrl;

  const [comments, setComments] = useState<CommentWithLocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(totalComments);

  const [replyingTo, setReplyingTo] = useState<{ commentId: number; userName: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [replies, setReplies] = useState<Record<number, ReplyWithLocal[]>>({});
  const [replyLoading, setReplyLoading] = useState<Record<number, boolean>>({});
  const [replyPage, setReplyPage] = useState<Record<number, number>>({});
  const [replyHasNext, setReplyHasNext] = useState<Record<number, boolean>>({});

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    setLocalCommentCount(totalComments);
  }, [totalComments]);

  const loadComments = useCallback(async (page: number, append = false) => {
    try {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      const res = await getReelComments(reelId, page);
      if (res.success) {
        const mapped: CommentWithLocal[] = res.data.data.map((c) => ({
          ...c,
          localIsLiked: !!c.isLovedByCurrentUser,
          localLikes: Number(c.commentLikeCount || 0),
        }));
        setComments((prev) => (append ? [...prev, ...mapped] : mapped));
        setHasNextPage(res.data.meta.hasNextPage);
        setPageNumber(page);
      }
    } catch (e) {
      console.error("Failed to load comments", e);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [reelId]);

  useEffect(() => {
    loadComments(1);
  }, [reelId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      if (replyingTo) {
        await addReply(trimmed, replyingTo.commentId);
        setText("");
        setReplyingTo(null);
        if (expandedReplies.has(replyingTo.commentId)) {
          loadReplies(replyingTo.commentId, 1);
        }
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyingTo.commentId
              ? { ...c, repliesCount: (c.repliesCount || 0) + 1 }
              : c
          )
        );
      } else {
        await addComment(trimmed, reelId);
        setText("");
        setLocalCommentCount((c) => c + 1);
        loadComments(1);
        onCommentAdded?.();
      }
    } catch (e) {
      console.error("Failed to add comment/reply", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleLike = async (commentId: number, index: number) => {
    setComments((prev) => {
      const next = [...prev];
      const c = { ...next[index] };
      c.localIsLiked = !c.localIsLiked;
      c.localLikes = (Number(c.localLikes) || 0) + (c.localIsLiked ? 1 : -1);
      next[index] = c;
      return next;
    });
    try {
      await toggleCommentLike(commentId);
    } catch (e) {
      setComments((prev) => {
        const next = [...prev];
        const c = { ...next[index] };
        c.localIsLiked = !c.localIsLiked;
        c.localLikes = (Number(c.localLikes) || 0) + (c.localIsLiked ? 1 : -1);
        next[index] = c;
        return next;
      });
    }
  };

  const handleToggleReplyLike = async (commentId: number, replyId: number, replyIndex: number) => {
    setReplies((prev) => {
      const commentReplies = [...(prev[commentId] || [])];
      const r = { ...commentReplies[replyIndex] };
      r.localIsLiked = !r.localIsLiked;
      r.localLikes = (Number(r.localLikes) || 0) + (r.localIsLiked ? 1 : -1);
      commentReplies[replyIndex] = r;
      return { ...prev, [commentId]: commentReplies };
    });
    try {
      await toggleReplyLike(replyId);
    } catch (e) {
      setReplies((prev) => {
        const commentReplies = [...(prev[commentId] || [])];
        const r = { ...commentReplies[replyIndex] };
        r.localIsLiked = !r.localIsLiked;
        r.localLikes = (Number(r.localLikes) || 0) + (r.localIsLiked ? 1 : -1);
        commentReplies[replyIndex] = r;
        return { ...prev, [commentId]: commentReplies };
      });
    }
  };

  const loadReplies = useCallback(async (commentId: number, page: number) => {
    try {
      setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
      const res = await getCommentReplies(commentId, page);
      if (res.success) {
        const mapped: ReplyWithLocal[] = res.data.data.map((r) => ({
          ...r,
          localIsLiked: !!r.isLovedByCurrentUser,
          localLikes: Number(r.likeCount || 0),
        }));
        setReplies((prev) => ({
          ...prev,
          [commentId]: page === 1 ? mapped : [...(prev[commentId] || []), ...mapped],
        }));
        setReplyPage((prev) => ({ ...prev, [commentId]: page }));
        setReplyHasNext((prev) => ({ ...prev, [commentId]: res.data.meta.hasNextPage }));
      }
    } catch (e) {
      console.error("Failed to load replies", e);
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  }, []);

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
        if (!replies[commentId]) {
          loadReplies(commentId, 1);
        }
      }
      return next;
    });
  };

  const startReply = (commentId: number, userName: string) => {
    setReplyingTo({ commentId, userName });
    setText("");
    setShowEmojiPicker(false);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setText("");
  };

  const renderReplyItem = (commentId: number, item: ReplyWithLocal, index: number) => (
    <View key={item.id} style={styles.replyItem}>
      {item.userImage ? (
        <Image
          source={
            item.userImage.trim().startsWith("http")
              ? { uri: item.userImage.trim() }
              : { uri: `${process.env.EXPO_PUBLIC_API_URL}/${item.userImage.trim()}` }
          }
          style={styles.replyAvatar}
        />
      ) : (
        <View style={[styles.replyAvatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>
            {(item.userName || "?").charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.replyContent}>
        <View style={styles.commentTopRow}>
          <Text style={styles.replyUsername}>{item.userName || "Unknown"}</Text>
          <TouchableOpacity
            style={styles.likeSection}
            onPress={() => handleToggleReplyLike(commentId, item.id, index)}
          >
            <SvgXml xml={heartSmall} width={14} height={12} />
            <Text style={styles.replyLikeCount}>{item.localLikes}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.replyText}>{item.content}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: CommentWithLocal; index: number }) => {
    const isExpanded = expandedReplies.has(item.id);
    const itemReplies = replies[item.id] || [];
    const isLoadingReplies = replyLoading[item.id] || false;
    const hasMoreReplies = replyHasNext[item.id] || false;

    return (
      <View style={styles.commentItem}>
        {item.userImage ? (
          <Image
            source={
              item.userImage.trim().startsWith("http")
                ? { uri: item.userImage.trim() }
                : { uri: `${process.env.EXPO_PUBLIC_API_URL}/${item.userImage.trim()}` }
            }
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {(item.userName || "?").charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.commentContent}>
          <View style={styles.commentTopRow}>
            <Text style={styles.username}>{item.userName || "Unknown User"}</Text>
            <TouchableOpacity
              style={styles.likeSection}
              onPress={() => handleToggleLike(item.id, index)}
            >
              <SvgXml xml={heartSmall} width={18} height={16} />
              <Text style={styles.likeCount}>{item.localLikes}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>

          <View style={styles.commentActions}>
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => startReply(item.id, item.userName)}
            >
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
            {item.repliesCount > 0 && (
              <TouchableOpacity
                style={styles.viewRepliesButton}
                onPress={() => toggleReplies(item.id)}
              >
                <Text style={styles.viewRepliesText}>
                  {isExpanded ? "Hide" : "View"} {item.repliesCount} {item.repliesCount === 1 ? "reply" : "replies"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isExpanded && (
            <View style={styles.repliesContainer}>
              {isLoadingReplies && itemReplies.length === 0 ? (
                <ActivityIndicator color="#959595" style={{ marginVertical: verticalScale(8) }} />
              ) : (
                <>
                  {itemReplies.map((reply, rIdx) => (
                    <View key={reply.id}>
                      {renderReplyItem(item.id, reply, rIdx)}
                    </View>
                  ))}
                  {hasMoreReplies && (
                    <TouchableOpacity
                      style={styles.loadMoreReplies}
                      onPress={() => loadReplies(item.id, (replyPage[item.id] || 1) + 1)}
                      disabled={isLoadingReplies}
                    >
                      {isLoadingReplies ? (
                        <ActivityIndicator color="#959595" size="small" />
                      ) : (
                        <Text style={styles.loadMoreRepliesText}>Load more replies</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderFooter = () =>
    isLoadingMore ? (
      <ActivityIndicator color="#959595" style={{ marginVertical: verticalScale(10) }} />
    ) : null;

  return (
    <View style={[styles.container, { maxHeight: height * 0.8, minHeight: height * 0.5 }]}>
      <View style={styles.header}>
        <View style={styles.handle} />
        <Text style={styles.headerTitle}>{localCommentCount} comments</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <SvgXml xml={closeIcon} width={24} height={24} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#959595" />
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (hasNextPage && !isLoadingMore) loadComments(pageNumber + 1, true);
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
          }
        />
      )}

      {showEmojiPicker && (
        <View style={styles.emojiPickerContainer}>
          <ScrollView
            style={styles.emojiScroll}
            contentContainerStyle={styles.emojiGrid}
            showsVerticalScrollIndicator={false}
          >
            {EMOJI_DATA.map((emoji, i) => (
              <TouchableOpacity
                key={i}
                style={styles.emojiItem}
                onPress={() => {
                  setText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : verticalScale(10) }]}>
        {replyingTo && (
          <View style={styles.replyingBar}>
            <Text style={styles.replyingText} numberOfLines={1}>
              Replying to {replyingTo.userName}
            </Text>
            <TouchableOpacity onPress={cancelReply} style={styles.cancelReplyBtn}>
              <Text style={styles.cancelReplyText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          {userAvatarUrl?.trim().toLowerCase().endsWith(".svg") ? (
            <RemoteSvg
              uri={
                userAvatarUrl.trim().startsWith("http")
                  ? userAvatarUrl.trim()
                  : `${process.env.EXPO_PUBLIC_API_URL}/${userAvatarUrl.trim()}`
              }
              width={styles.inputAvatar.width}
              height={styles.inputAvatar.height}
              fallback={require("../../../assests/imgs/Profile.png")}
              style={styles.inputAvatar}
            />
          ) : (
            <Image
              source={
                userAvatarUrl?.trim()
                  ? userAvatarUrl.trim().startsWith("http")
                    ? { uri: userAvatarUrl.trim() }
                    : { uri: `${process.env.EXPO_PUBLIC_API_URL}/${userAvatarUrl.trim()}` }
                  : require("../../../assests/imgs/Profile.png")
              }
              style={styles.inputAvatar}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder={replyingTo ? `Reply to ${replyingTo.userName}...` : "Add comment..."}
            placeholderTextColor="#959595"
            multiline={false}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <View style={styles.inputIcons}>
            <TouchableOpacity
              style={styles.inputIcon}
              onPress={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Text style={styles.emojiBtnText}>😊</Text>
            </TouchableOpacity>
            {text.trim().length > 0 && (
              <TouchableOpacity
                style={[styles.inputIcon, styles.sendBtn]}
                onPress={handleSend}
                disabled={isSending}
              >
                <Text style={styles.sendText}>{isSending ? "..." : "Post"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentsBottomSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopStartRadius: scale(20),
    borderTopEndRadius: scale(20),
  },
  header: {
    paddingVertical: verticalScale(15),
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    position: "relative",
  },
  handle: {
    width: scale(40),
    height: verticalScale(4),
    backgroundColor: "#E0E0E0",
    borderRadius: scale(2),
    position: "absolute",
    top: verticalScale(8),
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: scale(14),
    color: "#000",
  },
  closeBtn: {
    position: "absolute",
    right: scale(20),
    top: verticalScale(15),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(40),
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  emptyText: {
    textAlign: "left",
    color: "#959595",
    fontFamily: "Inter-Regular",
    fontSize: scale(14),
    marginTop: verticalScale(30),
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: verticalScale(16),
    alignItems: "flex-start",
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginEnd: scale(12),
  },
  avatarPlaceholder: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: scale(14),
    fontFamily: "Inter-SemiBold",
    color: "#555",
  },
  commentContent: {
    flex: 1,
  },
  commentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(2),
  },
  username: {
    fontFamily: "Inter-SemiBold",
    fontSize: scale(13),
    color: "#000",
  },
  commentText: {
    fontFamily: "Inter-Regular",
    fontSize: scale(13),
    color: "#444",
    lineHeight: scale(18),
  },
  likeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  likeCount: {
    fontSize: scale(10),
    color: "#959595",
    marginTop: verticalScale(2),
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(6),
    gap: scale(16),
  },
  replyButton: {
    paddingVertical: verticalScale(2),
  },
  replyButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: scale(12),
    color: "#959595",
  },
  viewRepliesButton: {
    paddingVertical: verticalScale(2),
  },
  viewRepliesText: {
    fontFamily: "Inter-SemiBold",
    fontSize: scale(12),
    color: "#47C0D2",
  },
  repliesContainer: {
    marginTop: verticalScale(8),
    paddingLeft: scale(10),
    borderLeftWidth: 2,
    borderLeftColor: "#E8E8E8",
  },
  replyItem: {
    flexDirection: "row",
    marginBottom: verticalScale(12),
    alignItems: "flex-start",
  },
  replyAvatar: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    marginEnd: scale(10),
  },
  replyContent: {
    flex: 1,
  },
  replyUsername: {
    fontFamily: "Inter-SemiBold",
    fontSize: scale(11),
    color: "#000",
  },
  replyText: {
    fontFamily: "Inter-Regular",
    fontSize: scale(12),
    color: "#444",
    lineHeight: scale(16),
  },
  replyLikeCount: {
    fontSize: scale(9),
    color: "#959595",
    marginTop: verticalScale(1),
  },
  loadMoreReplies: {
    paddingVertical: verticalScale(4),
  },
  loadMoreRepliesText: {
    fontFamily: "Inter-SemiBold",
    fontSize: scale(11),
    color: "#959595",
  },
  emojiPickerContainer: {
    height: verticalScale(200),
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
  },
  emojiScroll: {
    flex: 1,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },
  emojiItem: {
    width: `${100 / 8}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiText: {
    fontSize: scale(24),
  },
  inputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  replyingBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(4),
    backgroundColor: "#F5F5F5",
  },
  replyingText: {
    fontFamily: "Inter-Regular",
    fontSize: scale(12),
    color: "#666",
    flex: 1,
  },
  cancelReplyBtn: {
    padding: scale(4),
    marginStart: scale(8),
  },
  cancelReplyText: {
    fontSize: scale(14),
    color: "#959595",
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
  },
  input: {
    flex: 1,
    height: verticalScale(40),
    fontFamily: "Inter-Regular",
    fontSize: scale(14),
    color: "#000",
  },
  inputAvatar: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    marginEnd: scale(10),
  },
  inputIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginStart: scale(15),
  },
  emojiBtnText: {
    fontSize: scale(22),
  },
  sendBtn: {
    backgroundColor: "#000",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: scale(20),
  },
  sendText: {
    color: "#fff",
    fontSize: scale(12),
    fontFamily: "Inter-SemiBold",
  },
});
