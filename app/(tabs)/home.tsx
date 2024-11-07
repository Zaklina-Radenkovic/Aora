import { useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl } from "react-native";

import { images } from "../../constants";
import Trending from "@/components/Trending";
import SearchInput from "@/components/SearchInput";
import useAppwrite from "@/lib/useAppwrite";
import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";

import { getAllPosts, getLatestPosts } from "@/lib/appwrite";

export interface VideoPostProps {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const Home = () => {
  const { data: posts, refetch } = useAppwrite<VideoPostProps[] | any>(
    getAllPosts
  );

  const { data: latestPosts } = useAppwrite<VideoPostProps[] | any>(
    getLatestPosts
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary ">
      <FlatList<VideoPostProps>
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            // title={item.title}
            // thumbnail={item.thumbnail}
            video={item}
            // creator={item.creator.username}
            // avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  JSMastery
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput initialQuery={undefined} />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
