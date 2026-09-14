import React, { useRef, useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { scale, vs, s } from "react-native-size-matters";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { SvgXml } from "react-native-svg";
import { VideoView, useVideoPlayer } from "expo-video";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { JSX } from "react/jsx-runtime";
import CommentsBottomSheet from "../components/CommentsBottomSheet";
import { heartFilled, heartOutline, shareIcon } from "../../../assests/icons/AllIcon";
import RemoteSvg from "../components/RemoteSvg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Reel, toggleReelLike } from "../services";
import { absoluteUrl } from "../../../config/env";
import { useReelViewTracker } from "../hooks/useReelViewTracker";
import useBrandReels from "../hooks/BrandProfile/useBrandReels";
import useBrandInfo from "../hooks/BrandProfile/useBrandInfo";
import { useShareReel } from "../hooks/useShareReel";
import FilterOverlay from "../../brand/components/ReelManagement/FilterOverlay";

const { height, width } = Dimensions.get("window");

// Extended Reel type with local like state
type ReelWithLike = Reel & { localIsLiked: boolean; localLikes: number };

interface ReelItemProps {
  item: ReelWithLike;
  isActive: boolean;
  isPaused: boolean;
  onPress: () => void;
  onDurationReady?: (reelId: number, duration: number) => void;
  shouldLoadVideo: boolean;
}

const ReelVideoPlayer = ({
  videoUrl,
  isActive,
  isPaused,
  reelId,
  onDurationReady,
}: {
  videoUrl: string;
  isActive: boolean;
  isPaused: boolean;
  reelId: number;
  onDurationReady?: (reelId: number, duration: number) => void;
}) => {
  const source = absoluteUrl(videoUrl);
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    if (isActive && !isPaused) {
      player.play();
    }
  });

  useEffect(() => {
    if (player.duration && onDurationReady) {
      onDurationReady(reelId, player.duration);
    }
  }, [player.duration]);

  useEffect(() => {
    if (isActive) {
      if (isPaused) {
        player.pause();
      } else {
        player.play();
      }
    } else {
      player.pause();
    }
  }, [isActive, isPaused, player]);

  return (
    <VideoView
      player={player}
      style={styles.video}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

const ReelItem = ({ item, isActive, isPaused, onPress, onDurationReady, shouldLoadVideo }: ReelItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={onPress}
    >
      {shouldLoadVideo && (
        <View style={StyleSheet.absoluteFill}>
          <ReelVideoPlayer
            videoUrl={item.videoUrl}
            isActive={isActive}
            isPaused={isPaused}
            reelId={item.reelId}
            onDurationReady={onDurationReady}
          />
          {item.filterId && (
            <FilterOverlay
              activeFilterId={item.filterId}
              visible={true}
              readOnly={true}
            />
          )}
        </View>
      )}
      {isPaused && (
        <View style={styles.overlay}>
          <View style={styles.triangle} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function BrandReelsScreen({ route, onClose, brandId: propBrandId, initialIndex: propInitialIndex }: any): JSX.Element {
  const navigation = useNavigation<any>();
  const brandId = propBrandId || route?.params?.brandId;
  const initialIndex = propInitialIndex !== undefined ? propInitialIndex : (route?.params?.initialIndex || 0);

  const [reels, setReels] = useState<ReelWithLike[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(initialIndex);
  const [pausedVideos, setPausedVideos] = useState<boolean[]>([]);
  const [showComments, setShowComments] = useState(false);
  const { shareReel } = useShareReel();

  const handleCommentAdded = useCallback(() => {
    setReels((prev) => {
      const next = [...prev];
      const r = { ...next[currentPage] };
      r.numOfComments = (r.numOfComments || 0) + 1;
      next[currentPage] = r;
      return next;
    });
  }, [currentPage]);

  const { 
    response: brandReels, 
    loading: isBrandLoading, 
  } = useBrandReels(brandId);

  const {
    response: brandInfoResponse,
  } = useBrandInfo(brandId);

  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const animation = useRef(new Animated.Value(0)).current;
  const { startTracking, pauseTracking, resumeTracking, registerDuration } = useReelViewTracker();

  // Augment API reels with local like state
  useEffect(() => {
    if (brandReels) {
      setReels(
        brandReels.map((r: any) => ({
          ...r,
          localIsLiked: r.isLiked,
          localLikes: r.numOfLikes,
        }))
      );
    }
  }, [brandReels]);

  useEffect(() => {
    setPausedVideos(reels.map(() => false));
  }, [reels.length]);

  const handleDurationReady = useCallback((reelId: number, duration: number) => {
    registerDuration(reelId, duration);
  }, [registerDuration]);


  const handlePageChange = (e: PagerViewOnPageSelectedEvent) => {
    const page = e.nativeEvent.position;
    setCurrentPage(page);
    setPausedVideos(reels.map(() => false));
    
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const reelId = reels[page]?.reelId;
    if (reelId) {
      startTracking(reelId);
    }
  };

  const togglePlayPause = (index: number) => {
    if (index === currentPage) {
      const isCurrentlyPaused = pausedVideos[index] ?? false;
      if (isCurrentlyPaused) {
        resumeTracking();
      } else {
        pauseTracking();
      }
    }
    setPausedVideos((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const heartScale = useRef(new Animated.Value(1)).current;

  const toggleLike = async (index: number) => {
    const reel = reels[index];
    if (!reel) return;

    // Optimistic update
    setReels((prev) => {
      const newState = [...prev];
      const r = newState[index];
      if (r.localIsLiked) {
        r.localLikes -= 1;
      } else {
        r.localLikes += 1;
        Animated.sequence([
          Animated.spring(heartScale, { toValue: 1.3, useNativeDriver: true }),
          Animated.spring(heartScale, { toValue: 1, useNativeDriver: true }),
        ]).start();
      }
      r.localIsLiked = !r.localIsLiked;
      return newState;
    });

    try {
      await toggleReelLike(reel.reelId);
    } catch (e) {
      console.error("Failed to toggle reel like", e);
      // Revert on failure
      setReels((prev) => {
        const newState = [...prev];
        const r = newState[index];
        if (r.localIsLiked) {
          r.localLikes -= 1;
        } else {
          r.localLikes += 1;
        }
        r.localIsLiked = !r.localIsLiked;
        return newState;
      });
    }
  };

  const translateYIcons = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });
  const scaleIcons = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  if (isBrandLoading && reels.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      {reels.length > 0 ? (
        <PagerView
          style={styles.pagerView}
          initialPage={initialIndex}
          orientation="vertical"
          onPageSelected={handlePageChange}
        >
          {reels.map((item, index) => (
            <ReelItem
              key={item.reelId != null ? String(item.reelId) : String(index)}
              item={item}
              isActive={isFocused && currentPage === index}
              isPaused={pausedVideos[index] ?? false}
              onPress={() => togglePlayPause(index)}
              onDurationReady={handleDurationReady}
              shouldLoadVideo={Math.abs(index - currentPage) <= 1}
            />
          ))}
        </PagerView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      
      <View style={[styles.topOverlay, { top: insets.top }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', paddingHorizontal: scale(15) }}>
          <TouchableOpacity 
            onPress={() => onClose ? onClose() : navigation.goBack()}
            style={{ padding: 5 }}
          >
            <Text style={{ color: '#fff', fontSize: scale(24), fontWeight: '300' }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View
        style={[
          styles.rightIconsContainer,
          {
            transform: [{ translateY: translateYIcons }, { scale: scaleIcons }],
          },
        ]}
      >
        {/* Brand Profile Picture on the Side */}
        <View style={{ alignItems: 'center', marginBottom: scale(5) }}>
          <LinearGradient
            colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <View style={styles.brandImageInner}>
              {(() => {
                const hookBrandImg = brandInfoResponse?.brandImageUrl?.trim();
                const itemBrandImg = reels[currentPage]?.brandImageUrl?.trim();
                const brandImg = hookBrandImg || itemBrandImg;
                
                const finalUrl = brandImg 
                  ? (brandImg.startsWith("http") ? brandImg : `${process.env.EXPO_PUBLIC_API_URL}/${brandImg}`)
                  : null;

                if (brandImg?.toLowerCase().endsWith(".svg")) {
                  return (
                    <RemoteSvg
                      uri={finalUrl!}
                      width={scale(32)}
                      height={scale(32)}
                      fallback={require("../../../assests/imgs/Profile.png")}
                      style={styles.bottomBrandImage}
                    />
                  );
                }

                return (
                  <Image
                    source={finalUrl ? { uri: finalUrl } : require("../../../assests/imgs/Profile.png")}
                    style={styles.bottomBrandImage}
                  />
                );
              })()}
            </View>
          </LinearGradient>
        </View>

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => toggleLike(currentPage)}
        >
          <Animated.View style={{ transform: [{ scale: reels[currentPage]?.localIsLiked ? heartScale : 1 }] }}>
            <SvgXml xml={reels[currentPage]?.localIsLiked ? heartFilled : heartOutline} width={ scale(28)} height={ scale(26)} />
          </Animated.View>
          <Text style={styles.iconText}>{reels[currentPage]?.localLikes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => {
            const reel = reels[currentPage];
            if (reel) shareReel(reel.reelId, reel.title);
          }}
        >
          <SvgXml xml={shareIcon} width={scale(28)} height={scale(28)} />
          <Text style={styles.iconText}>Share</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Reel Title at the Bottom */}
      <View style={styles.bottomDetailsContainer}>
        <Text style={styles.reelTitle} numberOfLines={2}>
          {reels[currentPage]?.title || reels[currentPage]?.brandName}
        </Text>
      </View>

      {/* Instagram Bottom Comment Bar */}
      <View style={[styles.commentBarContainer, { bottom: insets.bottom + scale(10) }]}>
        <TouchableOpacity 
          style={styles.commentBarInner}
          onPress={() => setShowComments(true)}
        >
          <Text style={styles.commentBarText}>إضافة تعليق...</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showComments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoidingModal}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowComments(false)}
          />
            <CommentsBottomSheet
              onClose={() => setShowComments(false)}
              reelId={reels[currentPage]?.reelId ?? 0}
              totalComments={reels[currentPage]?.numOfComments ?? 0}
              brandImageUrl={reels[currentPage]?.brandImageUrl}
              onCommentAdded={handleCommentAdded}
            />
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pagerView: { flex: 1, backgroundColor: "#000" },
  loadingContainer: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#000", overflow: "hidden" },
  video: { height: "100%", width: "100%", position: "absolute" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 45,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    transform: [{ rotate: "90deg" }],
    opacity: 0.8,
  },
  topOverlay: {
    position: "absolute",
    top: 40,
    left: 0,
    width: "100%",
    zIndex: 999,
  },
  rightIconsContainer: {
    position: "absolute",
    right: scale(15),
    bottom: height * 0.25,
    zIndex: 999,
    alignItems: "center",
    gap: scale(15),
  },
  bottomDetailsContainer: {
    position: "absolute",
    left: scale(15),
    bottom: height * 0.1,
    zIndex: 999,
    width: width * 0.7,
  },
  bottomBrandImage: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
  },
  reelTitle: {
    color: "#fff",
    fontSize: scale(13),
    fontFamily: "Inter",
    opacity: 0.9,
    marginBottom: scale(10),
  },
  iconWrapper: { alignItems: "center" },
  iconText: { color: "#ffff", fontSize: 12, marginTop: 4, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  keyboardAvoidingModal: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gradientBorder: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: "center",
    alignItems: "center",
  },
  brandImageInner: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#000",
  },
  commentBarContainer: {
    position: "absolute",
    left: scale(15),
    right: scale(15),
    zIndex: 1000,
  },
  commentBarInner: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  commentBarText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scale(13),
    fontFamily: "Inter",
  },
});
