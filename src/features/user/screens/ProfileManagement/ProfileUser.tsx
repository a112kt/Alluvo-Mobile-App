import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import UserInfo from "../../components/ProfileManagement/UserInfo";
import { verticalScale } from "react-native-size-matters";
import RecentView from "../../components/ProfileManagement/RecentView";
import MyOrders from "../../components/ProfileManagement/MyOrders";
import FollowingList from "../../components/ProfileManagement/FollowingList";
import { lightColors } from "../../../../../theme";
import { useProfile } from "../../hooks/UserProfile/useProfile";
import { useFloatingTabBarPadding } from "../../../../hooks/useFloatingTabBarPadding";
import { useQueryClient } from "@tanstack/react-query";
import { RECENT_VIEWS_QUERY_KEY } from "../../hooks/useRecentViews";

const ProfileUser = () => {
  const { data: profileResponse, isLoading, refetch } = useProfile();
  const queryClient = useQueryClient();
  const [showFollowing, setShowFollowing] = React.useState(false);
  const tabBarPadding = useFloatingTabBarPadding();

  const profileData = profileResponse?.data;

  const handleRefresh = useCallback(() => {
    refetch();
    queryClient.invalidateQueries({ queryKey: RECENT_VIEWS_QUERY_KEY });
  }, [refetch, queryClient]);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ ...styles.scrollContent, paddingBottom: tabBarPadding }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[lightColors.primary]}
            tintColor={lightColors.primary}
          />
        }
      >
        <UserInfo
          profileData={profileData}
          isLoading={isLoading}
          onFollowingPress={() => setShowFollowing(true)}
        />
        <RecentView />
        <MyOrders />
      </ScrollView>

      <FollowingList
        visible={showFollowing}
        onClose={() => setShowFollowing(false)}
      />
    </>
  );
};

export default ProfileUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
});
