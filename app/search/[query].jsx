import { FlatList, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { getSearchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
const {query} = useLocalSearchParams()
  const { data: posts, refetch } = useAppwrite( () =>
    getSearchPosts(query)
  );

useEffect(() => {
  refetch()
}, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
      data = {posts}
      keyExtractor={(item) => item.$id}
      renderItem={({item})=>(
      <VideoCard video={item} />
      )}
      ListHeaderComponent={()=>(
        <View className="my-6 px-4">
              <Text className="font-pmedium text-sm text-gray-100">
                Search Result
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {query}
              </Text>
              <View className="mt-6 mb-8">
              <SearchInput initialQuery={query}/>
              </View>
        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState 
        title="No videos"
        subtitle="No videos found for this query"
        />
      )}
      />
    </SafeAreaView>
  )
}

export default Search
