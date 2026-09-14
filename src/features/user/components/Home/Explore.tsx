import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import { s, vs, ms } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserStackParamList } from "../../../../Navigation/types";
import { useHomeReels } from "../../hooks/Home/useHomeReels";
import { getReelThumbnailSource, getReelThumbnailUri, PLACEHOLDER_REEL } from "../../../../utils/imageUtils";
import { VideoView, useVideoPlayer } from "expo-video";

const { width } = Dimensions.get("window");
const REEL_WIDTH = width * 0.45;

type NavProp = NativeStackNavigationProp<UserStackParamList>;

const LOADING_ITEMS = [1, 2, 3];

const VideoThumbnail = ({ videoUrl }: { videoUrl: string }) => {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.pause();
  });

  return (
    <VideoView
      player={player}
      style={styles.image}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

const Explore = () => {
  const navigation = useNavigation<NavProp>();
  const { data, isLoading, isError, refetch } = useHomeReels();
  const reels = data?.data?.data ?? [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Watch Reels</Text>
            <Text style={styles.subTitle}>See it in motion</Text>
          </View>
        </View>
        <View style={styles.listContent}>
          <View style={{ flexDirection: "row", gap: s(15) }}>
            {LOADING_ITEMS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.reelCard,
                  {
                    backgroundColor: "#2A2A5A",
                    marginTop: 0,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Watch Reels</Text>
            <Text style={styles.subTitle}>See it in motion</Text>
          </View>
        </View>
        <View style={{ alignItems: "center", paddingVertical: vs(30) }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: ms(14), marginBottom: vs(12) }}>
            Failed to load reels.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={{
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
              paddingVertical: vs(8),
              paddingHorizontal: s(20),
              borderRadius: 20,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#FFF", fontSize: ms(12), fontWeight: "600" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (reels.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Watch Reels</Text>
            <Text style={styles.subTitle}>See it in motion</Text>
          </View>
        </View>
        <View style={{ alignItems: "center", paddingVertical: vs(30) }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: ms(14) }}>
            No reels available yet.
          </Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;
    const thumbUri = getReelThumbnailUri(item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ReelDetail", { initialReelId: item.reelId })}
        style={[
          styles.reelCard,
          { marginTop: isEven ? vs(0) : vs(25) },
        ]}
      >
        {thumbUri ? (
          <Image
            source={{ uri: thumbUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : item.videoUrl ? (
          <VideoThumbnail videoUrl={item.videoUrl} />
        ) : (
          <Image
            source={PLACEHOLDER_REEL}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.9)"]}
          style={styles.overlay}
        />
        <View style={styles.playIconContainer}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameText}>{item.brandName || `@Brand_${item.brandId}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Watch Reels</Text>
          <Text style={styles.subTitle}>See it in motion</Text>
        </View>
        <TouchableOpacity
          style={styles.moreShortsBtn}
          onPress={() => navigation.navigate("ReelDetail")}
        >
          <Text style={styles.moreShortsText}>MORE SHORTS</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={reels}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => String(item.reelId)}
        snapToInterval={REEL_WIDTH + s(15)}
        decelerationRate="fast"
      />
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#050A30",
    paddingVertical: vs(30),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: s(20),
    marginBottom: vs(25),
  },

  title: {
    fontSize: ms(28),
    fontWeight: "bold",
    color: "#FFF",
  },

  subTitle: {
    fontSize: ms(14),
    color: "rgba(255,255,255,0.6)",
    marginTop: vs(2),
  },

  moreShortsBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: vs(8),
    paddingHorizontal: s(15),
    borderRadius: 20,
  },

  moreShortsText: {
    color: "#FFF",
    fontSize: ms(10),
    fontWeight: "600",
    letterSpacing: 1,
  },

  listContent: {
    paddingLeft: s(20),
    paddingRight: s(10),
  },

  reelCard: {
    width: REEL_WIDTH,
    height: vs(270),
    marginRight: s(15),
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#1B2351",
    justifyContent: "flex-end",
  },

  image: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  playIconContainer: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    color: "#FFF",
    fontSize: ms(16),
    marginLeft: 3,
  },

  usernameContainer: {
    padding: s(12),
  },

  usernameText: {
    color: "#FFF",
    fontSize: ms(12),
    fontWeight: "bold",
  },
});
