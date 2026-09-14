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
  NativeSyntheticEvent,
  NativeTouchEvent,
  I18nManager,
} from "react-native";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { SvgXml } from "react-native-svg";
import RemoteSvg from "../components/RemoteSvg";
import { VideoView, useVideoPlayer } from "expo-video";
import { useIsFocused, useNavigation, NavigationProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../Navigation/types";
import ExploreForuOrFollowing from "../components/ExploreForuOrFollowing";
import { LinearGradient } from "expo-linear-gradient";
import ProductList from "../components/ProductList";
import CommentsBottomSheet from "../components/CommentsBottomSheet";
import { commitIcon, heartFilled, heartOutline, productCart, shareIcon } from "../../../assests/icons/AllIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReels, ReelFeedType } from "../hooks/useReels";
import { Reel, toggleReelLike } from "../services";
import { useReelById } from "../hooks/useReelById";
import { useReelViewTracker } from "../hooks/useReelViewTracker";
import { useShareReel } from "../hooks/useShareReel";
import { getReelThumbnailSource, PLACEHOLDER_REEL, getReelThumbnailUri } from "../../../utils/imageUtils";
import { absoluteUrl } from "../../../config/env";
import FilterOverlay from "../../brand/components/ReelManagement/FilterOverlay";
import GradientButton from "../../../Components/buttons/GradientButton";
import DoubleTapHeartAnimation from "../../../Components/DoubleTapHeartAnimation";

const { height, width } = Dimensions.get("window");
const isRTL = I18nManager.isRTL;

type ReelWithLike = Reel & { localIsLiked: boolean; localLikes: number };

interface ReelItemProps {
  item: ReelWithLike;
  isActive: boolean;
  isPaused: boolean;
  onSingleTap: () => void;
  onDoubleTap: (x: number, y: number) => void;
  onDurationReady?: (reelId: number, duration: number) => void;
  shouldLoadVideo: boolean;
}

const ReelVideoPlayer = ({
  videoUrl,
  isActive,
  isPaused,
  reelId,
  onDurationReady,
  onFirstFrameRender,
}: {
  videoUrl: string;
  isActive: boolean;
  isPaused: boolean;
  reelId: number;
  onDurationReady?: (reelId: number, duration: number) => void;
  onFirstFrameRender: () => void;
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
      onFirstFrameRender={onFirstFrameRender}
    />
  );
};

const ReelItem = ({ item, isActive, isPaused, onSingleTap, onDoubleTap, onDurationReady, shouldLoadVideo }: ReelItemProps) => {
  const thumbUri = getReelThumbnailUri(item);
  const [thumbnailSource] = useState(() => getReelThumbnailSource(item));
  const [showThumbnail, setShowThumbnail] = useState(!!thumbUri);
  const [thumbHasError, setThumbHasError] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [heartAnim, setHeartAnim] = useState<{ visible: boolean; x: number; y: number }>({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleTouchEnd = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const { pageX, pageY } = event.nativeEvent;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
      }
      if (!item.localIsLiked) {
        setHeartAnim({ visible: true, x: pageX, y: pageY });
      }
      onDoubleTap(pageX, pageY);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      tapTimeoutRef.current = setTimeout(() => {
        onSingleTap();
        tapTimeoutRef.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  };

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  return (
    <View style={styles.container} onTouchEnd={handleTouchEnd}>
      {showThumbnail && (
        <Image
          key={`thumb-${item.reelId}`}
          source={thumbHasError ? PLACEHOLDER_REEL : thumbnailSource}
          style={styles.thumbnail}
          resizeMode="cover"
          onError={() => setThumbHasError(true)}
        />
      )}
      {shouldLoadVideo && (
        <View style={StyleSheet.absoluteFill}>
          <ReelVideoPlayer
            videoUrl={item.videoUrl}
            isActive={isActive}
            isPaused={isPaused}
            reelId={item.reelId}
            onDurationReady={onDurationReady}
            onFirstFrameRender={() => setShowThumbnail(false)}
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
      {isPaused && !showThumbnail && (
        <View style={styles.overlay}>
          <View style={styles.triangle} />
        </View>
      )}
      <DoubleTapHeartAnimation
        visible={heartAnim.visible}
        x={heartAnim.x}
        y={heartAnim.y}
        onAnimationEnd={() => setHeartAnim({ visible: false, x: 0, y: 0 })}
      />
    </View>
  );
};

const EmptyFollowingSvg = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="90" cy="90" r="86" stroke="rgba(71,192,210,0.2)" stroke-width="1.5" stroke-dasharray="8 5"/>
  <circle cx="90" cy="90" r="70" stroke="rgba(71,192,210,0.1)" stroke-width="1"/>
  <circle cx="68" cy="72" r="14" stroke="rgba(71,192,210,0.6)" stroke-width="2"/>
  <path d="M48 112c0-13 9-21 20-21s20 8 20 21" stroke="rgba(71,192,210,0.6)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="108" cy="66" r="11" stroke="rgba(71,192,210,0.45)" stroke-width="2"/>
  <path d="M94 106c0-11 7-18 14-18s14 7 14 18" stroke="rgba(71,192,210,0.45)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="130" cy="48" r="4" fill="rgba(71,192,210,0.3)"/>
  <line x1="130" y1="40" x2="130" y2="32" stroke="rgba(71,192,210,0.3)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="124" y1="36" x2="136" y2="36" stroke="rgba(71,192,210,0.3)" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const EmptyForYouSvg = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="28" y="32" width="124" height="108" rx="12" stroke="rgba(71,192,210,0.2)" stroke-width="1.5"/>
  <rect x="28" y="32" width="124" height="108" rx="12" fill="rgba(71,192,210,0.04)"/>
  <polygon points="78,62 78,108 112,85" fill="rgba(71,192,210,0.5)"/>
  <rect x="28" y="32" width="124" height="18" rx="12" fill="rgba(71,192,210,0.08)"/>
  <circle cx="42" cy="41" r="2.5" fill="#E74C3C"/>
  <circle cx="52" cy="41" r="2.5" fill="#F39C12"/>
  <circle cx="62" cy="41" r="2.5" fill="#2ECC71"/>
</svg>`;

export let exploreTabPressHandler: (() => void) | null = null;

// ─── FeedPage: self-contained vertical reel feed ──────────────────────────
function FeedPage({
  feedType,
  isFocused,
  insets,
  onNavigate,
}: {
  feedType: ReelFeedType;
  isFocused: boolean;
  insets: any;
  onNavigate: (...args: any[]) => void;
}) {
  const [reels, setReels] = useState<ReelWithLike[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pausedVideos, setPausedVideos] = useState<boolean[]>([]);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [showComments, setShowComments] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const [hasSetInitialPage, setHasSetInitialPage] = useState(false);
  const { shareReel } = useShareReel();

  const { data: apiReels, isLoading, load, loadMore, refresh, isSwitchingFeed } = useReels(feedType);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    exploreTabPressHandler = () => {
      refresh();
    };
    return () => {
      exploreTabPressHandler = null;
    };
  }, [refresh]);

  const animation = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  // Empty state animations
  const emptyIllustrationOpacity = useRef(new Animated.Value(0)).current;
  const emptyIllustrationTranslateY = useRef(new Animated.Value(30)).current;
  const emptyTitleOpacity = useRef(new Animated.Value(0)).current;
  const emptyTitleTranslateY = useRef(new Animated.Value(20)).current;
  const emptySubtitleOpacity = useRef(new Animated.Value(0)).current;
  const emptySubtitleTranslateY = useRef(new Animated.Value(20)).current;
  const emptyButtonsOpacity = useRef(new Animated.Value(0)).current;
  const orb1Opacity = useRef(new Animated.Value(0.4)).current;
  const orb2Opacity = useRef(new Animated.Value(0.6)).current;

  const startEmptyEntrance = useCallback(() => {
    emptyIllustrationOpacity.setValue(0);
    emptyIllustrationTranslateY.setValue(30);
    emptyTitleOpacity.setValue(0);
    emptyTitleTranslateY.setValue(20);
    emptySubtitleOpacity.setValue(0);
    emptySubtitleTranslateY.setValue(20);
    emptyButtonsOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(emptyIllustrationOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(emptyIllustrationTranslateY, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.stagger(150, [
        Animated.parallel([
          Animated.timing(emptyTitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(emptyTitleTranslateY, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(emptySubtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(emptySubtitleTranslateY, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ]),
        Animated.timing(emptyButtonsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orb1Opacity, { toValue: 0.8, duration: 4000, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.35, duration: 4000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orb1Opacity, { toValue: 0.35, duration: 4000, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.8, duration: 4000, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!isLoading && reels.length === 0) {
      startEmptyEntrance();
    }
  }, [isLoading, reels.length]);

  const { startTracking, pauseTracking, resumeTracking, registerDuration } = useReelViewTracker();

  useEffect(() => {
    let merged = apiReels.map((r) => ({
      ...r,
      localIsLiked: r.isLiked,
      localLikes: r.numOfLikes,
    }));
    setReels((prev) => {
      if (prev.length === merged.length && prev.every((r, i) => r.reelId === merged[i].reelId)) {
        return prev;
      }
      return merged;
    });
  }, [apiReels]);

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
    setShowCard(false);
    if (page >= reels.length - 3) loadMore();
    refresh();
    Animated.timing(animation, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    const reelId = reels[page]?.reelId;
    if (reelId) startTracking(reelId);
  };

  const togglePlayPause = (index: number) => {
    if (index === currentPage) {
      const isCurrentlyPaused = pausedVideos[index] ?? false;
      if (isCurrentlyPaused) resumeTracking();
      else pauseTracking();
    }
    setPausedVideos((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleLike = async (index: number) => {
    const reel = reels[index];
    if (!reel) return;
    setReels((prev) => {
      const newState = [...prev];
      const r = newState[index];
      if (r.localIsLiked) { r.localLikes -= 1; } else {
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
      refresh();
    } catch (e) {
      setReels((prev) => {
        const newState = [...prev];
        const r = newState[index];
        if (r.localIsLiked) { r.localLikes -= 1; } else { r.localLikes += 1; }
        r.localIsLiked = !r.localIsLiked;
        return newState;
      });
    }
  };

  const toggleProductCard = () => {
    const nextShowCard = !showCard;
    if (nextShowCard) {
      setShowCard(true);
      Animated.timing(animation, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    } else {
      Animated.timing(animation, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => setShowCard(false));
    }
  };

  const translateYIcons = animation.interpolate({ inputRange: [0, 1], outputRange: [0, -150] });
  const scaleIcons = animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] });
  const productButtonTranslateY = animation.interpolate({ inputRange: [0, 1], outputRange: [0, -250] });
  const productButtonOpacity = animation.interpolate({ inputRange: [0, 0.9, 1], outputRange: [1, 0, 0] });
  const productCardTranslateY = animation.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  if (isLoading && reels.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={["#0A0F1E", "#0D1B2A", "#0A0F1E"]} style={StyleSheet.absoluteFillObject} />
        <ActivityIndicator size="large" color="#47C0D2" />
      </View>
    );
  }

  const isEmptyFeed = !isLoading && reels.length === 0;

  if (isEmptyFeed) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar translucent backgroundColor="transparent" style="light" />
        <LinearGradient colors={["#0A0F1E", "#0D1B2A", "#0A0F1E"]} style={StyleSheet.absoluteFillObject} />
        <Animated.View style={[styles.orb, styles.orbTopRight, { opacity: orb1Opacity }]} />
        <Animated.View style={[styles.orb, styles.orbBottomLeft, { opacity: orb2Opacity }]} />

        <View style={styles.emptyStateContainer}>
          <Animated.View style={[styles.illustrationGlow, { opacity: emptyIllustrationOpacity, transform: [{ translateY: emptyIllustrationTranslateY }] }]}>
            <View style={styles.illustrationGlowBg} />
            <SvgXml xml={feedType === "following" ? EmptyFollowingSvg : EmptyForYouSvg} width={180} height={180} />
          </Animated.View>
          <Animated.Text style={[styles.emptyStateTitle, { opacity: emptyTitleOpacity, transform: [{ translateY: emptyTitleTranslateY }] }]}>
            {feedType === "following" ? "No Reels From Brands You Follow" : "No Reels Available"}
          </Animated.Text>
          <Animated.Text style={[styles.emptyStateSubtitle, { opacity: emptySubtitleOpacity, transform: [{ translateY: emptySubtitleTranslateY }] }]}>
            {feedType === "following" ? "You don't follow any brands yet. Discover brands to see their reels here." : "Check back later for new content from your favorite brands!"}
          </Animated.Text>
          <Animated.View style={[styles.emptyStateButtons, { opacity: emptyButtonsOpacity }]}>
            <GradientButton text="Discover Brands" onPress={() => onNavigate("Brands" as any)} style={styles.discoverButton} />
            <TouchableOpacity onPress={() => { refresh(); load(); }} style={styles.refreshButton} activeOpacity={0.7}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PagerView ref={pagerRef} style={styles.pagerView} initialPage={0} orientation="vertical" onPageSelected={handlePageChange}>
        {reels.map((item, index) => (
          <ReelItem
            key={item.reelId != null ? String(item.reelId) : String(index)}
            item={item}
            isActive={isFocused && currentPage === index}
            isPaused={pausedVideos[index] ?? false}
            onSingleTap={() => togglePlayPause(index)}
            onDoubleTap={(x, y) => {
              if (!item.localIsLiked) {
                toggleLike(index);
              }
            }}
            onDurationReady={handleDurationReady}
            shouldLoadVideo={Math.abs(index - currentPage) <= 1}
          />
        ))}
      </PagerView>

      {isSwitchingFeed && (
        <View style={styles.switchingOverlay}>
          <ActivityIndicator size="large" color="#47C0D2" />
        </View>
      )}

      {reels.length > 0 && (
        <>
          <Animated.View style={[styles.rightIconsContainer, { transform: [{ translateY: translateYIcons }, { scale: scaleIcons }] }]}>
            <TouchableOpacity onPress={() => { const bId = reels[currentPage]?.brandId; if (bId) onNavigate("BrandProfile", { brandId: bId }); }}>
              {(() => {
                const brandImg = reels[currentPage]?.brandImageUrl?.trim();
                const finalUrl = brandImg ? (brandImg.startsWith("http") ? brandImg : `${process.env.EXPO_PUBLIC_API_URL}/${brandImg}`) : null;
                if (brandImg?.toLowerCase().endsWith(".svg")) {
                  return <RemoteSvg uri={finalUrl!} width={30} height={30} fallback={require("../../../assests/imgs/Profile.png")} style={[styles.profileIconContainer, { justifyContent: "center", alignItems: "center" }]} />;
                }
                return <Image source={finalUrl ? { uri: finalUrl } : require("../../../assests/imgs/Profile.png")} style={styles.profileIcon} />;
              })()}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => toggleLike(currentPage)}>
              <Animated.View style={{ transform: [{ scale: reels[currentPage]?.localIsLiked ? heartScale : 1 }] }}>
                <SvgXml xml={reels[currentPage]?.localIsLiked ? heartFilled : heartOutline} width={30} height={28} />
              </Animated.View>
              <Text style={styles.iconText}>{reels[currentPage]?.localLikes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => setShowComments(true)}>
              <SvgXml xml={commitIcon} width={32} height={32} />
              <Text style={styles.iconText}>{reels[currentPage]?.numOfComments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => { const reel = reels[currentPage]; if (reel) shareReel(reel.reelId, reel.title); }}>
              <SvgXml xml={shareIcon} width={28} height={28} />
              <Text style={styles.iconText}>Share</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.productButtonContainer, { transform: [{ translateY: productButtonTranslateY }] }, { opacity: productButtonOpacity }]}>
            <LinearGradient colors={["rgba(27, 35, 81, 0.3)", "rgba(71, 192, 210, 0.3)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.productButtonGradient}>
              <TouchableOpacity style={styles.productButtonTouchable} onPress={toggleProductCard}>
                <SvgXml xml={productCart} width={24} height={24} />
                <Text style={styles.productButtonText}>{reels[currentPage]?.products?.length ?? 0} Products</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {showCard && (
            <Pressable style={styles.productCardBackdrop} onPress={toggleProductCard}>
              <Animated.View style={[styles.productCard, { transform: [{ translateY: productCardTranslateY }] }]}>
                <ProductList products={reels[currentPage]?.products ?? []} />
              </Animated.View>
            </Pressable>
          )}
        </>
      )}

      {reels.length > 0 && (
        <View style={styles.brandInfoOverlay}>
          <TouchableOpacity onPress={() => { const bId = reels[currentPage]?.brandId; if (bId) onNavigate("BrandProfile", { brandId: bId }); }}>
            <Text style={styles.brandNameText}>@{reels[currentPage]?.brandName || "Brand Name"}</Text>
          </TouchableOpacity>
          <Text style={styles.reelDescription} numberOfLines={2}>{reels[currentPage]?.title}</Text>
        </View>
      )}

      <Modal visible={showComments} transparent animationType="slide" onRequestClose={() => setShowComments(false)} statusBarTranslucent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardAvoidingModal}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowComments(false)} />
          <CommentsBottomSheet
            onClose={() => setShowComments(false)}
            reelId={reels[currentPage]?.reelId ?? 0}
            totalComments={reels[currentPage]?.numOfComments ?? 0}
            brandImageUrl={reels[currentPage]?.brandImageUrl}
            onCommentAdded={refresh}
          />
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Main ReelsScreen: horizontal pager wrapping two FeedPages ───────────
export default function ReelsScreen({ route }: any) {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const horizontalPagerRef = useRef<PagerView>(null);

  const initialReelId = route?.params?.initialReelId ?? route?.params?.reelId;

  // LTR: page 0 = following, page 1 = forYou
  // RTL: page 0 = forYou, page 1 = following
  const FOLLOWING_INDEX = isRTL ? 1 : 0;
  const FOR_YOU_INDEX = isRTL ? 0 : 1;

  const [horizontalPage, setHorizontalPage] = useState(isRTL ? FOR_YOU_INDEX : FOLLOWING_INDEX);
  const currentFeedType: ReelFeedType = horizontalPage === FOLLOWING_INDEX ? "following" : "forYou";

  const handleHorizontalPageChange = (e: PagerViewOnPageSelectedEvent) => {
    setHorizontalPage(e.nativeEvent.position);
  };

  const handleFeedChange = (feed: ReelFeedType) => {
    const targetIndex = feed === "following" ? FOLLOWING_INDEX : FOR_YOU_INDEX;
    setHorizontalPage(targetIndex);
    horizontalPagerRef.current?.setPage(targetIndex);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <PagerView
        ref={horizontalPagerRef}
        style={{ flex: 1 }}
        initialPage={horizontalPage}
        orientation="horizontal"
        onPageSelected={handleHorizontalPageChange}
        overScrollMode="never"
      >
        <View key="page-0" style={{ flex: 1 }}>
          <FeedPage
            feedType={isRTL ? "forYou" : "following"}
            isFocused={isFocused && (isRTL ? currentFeedType === "forYou" : currentFeedType === "following")}
            insets={insets}
            onNavigate={navigation.navigate.bind(navigation)}
          />
        </View>
        <View key="page-1" style={{ flex: 1 }}>
          <FeedPage
            feedType={isRTL ? "following" : "forYou"}
            isFocused={isFocused && (isRTL ? currentFeedType === "following" : currentFeedType === "forYou")}
            insets={insets}
            onNavigate={navigation.navigate.bind(navigation)}
          />
        </View>
      </PagerView>

      {/* Tab indicator overlay */}
      <View style={[styles.topOverlay, { top: insets.top + 10 }]}>
        <ExploreForuOrFollowing value={currentFeedType} onFeedChange={handleFeedChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagerView: { flex: 1, backgroundColor: "#000" },
  loadingContainer: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  switchingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 998,
  },
  container: { flex: 1, backgroundColor: "#000", overflow: "hidden" },
  video: { height: "100%", width: "100%", position: "absolute" },
  thumbnail: { height: "100%", width: "100%", position: "absolute", zIndex: 1, backgroundColor: "#111" },
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
    right: 15,
    bottom: height * 0.37,
    zIndex: 999,
    alignItems: "center",
    gap: 20,
  },
  profileIcon: { width: 40, height: 40, borderRadius: 20, marginBottom: 10 },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  iconWrapper: { alignItems: "center" },
  iconText: { color: "#ffff", fontSize: 12, marginTop: 4, fontWeight: "bold" },
  productButtonContainer: {
    position: "absolute",
    zIndex: 999,
    bottom: height * 0.24,
    right: 0,
  },
  productButtonGradient: {
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  productButtonTouchable: { flexDirection: "row", alignItems: "center" },
  productButtonText: { color: "white", marginStart: 8, fontWeight: "600" },
  productCard: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "50%",
    height: height * 0.5,
    overflow: "hidden",
  },
  productCardBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  keyboardAvoidingModal: {
    flex: 1,
    justifyContent: "flex-end",
  },
  brandInfoOverlay: {
    position: "absolute",
    left: 15,
    bottom: height * 0.25,
    zIndex: 998,
    width: "70%",
  },
  brandNameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  reelDescription: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  illustrationGlow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  illustrationGlowBg: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(71, 192, 210, 0.06)",
  },
  emptyStateTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  emptyStateSubtitle: {
    color: "#9FA1A3",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  emptyStateButtons: {
    marginTop: 32,
    alignItems: "center",
    width: "100%",
  },
  discoverButton: { width: 240 },
  refreshButton: { marginTop: 16, paddingVertical: 8, paddingHorizontal: 20 },
  refreshButtonText: { color: "#47C0D2", fontSize: 14, fontWeight: "500" },
  orb: { position: "absolute", width: 300, height: 300, borderRadius: 150 },
  orbTopRight: { top: -60, right: -80, backgroundColor: "rgba(71, 192, 210, 0.06)" },
  orbBottomLeft: { bottom: -80, left: -100, backgroundColor: "rgba(27, 35, 81, 0.1)" },
});
