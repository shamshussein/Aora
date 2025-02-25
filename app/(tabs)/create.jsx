import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import Video from 'expo-video';
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import * as DocumentPicker from 'expo-document-picker'
const Create = () => {
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  })
  const openPicker = async (selectType)=>{
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' 
      ?['image/png', 'image/jpeg']
      :['video/mp4', 'video/gif', 'video/quicktime']
    })
    if(!result.canceled){
      if(selectType === 'image'){
        setForm({...form, thumbnail: result.assets[0]})
      }
      if(selectType === 'video'){
        setForm({...form, video: result.assets[0]})
      }
    }
    else{
      setTimeout(()=>{
        Alert.alert('Document picked', JSON.stringify(result, null, 2))
      }, 100)
    }
  }
  const submit = ()=>{
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      return Alert.alert('Error', 'Please fill all fields')
    }
    setUploading(true)
    try {
      
    } catch (error) {
      Alert.alert('Error', error.message)
    }finally{
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      })
      setUploading(false);  
    }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>
        <FormField
        title="Video title"
        value={form.title}
        placeholder="give your video a catchy title"
        handleChangeText={(e)=> setForm({
          title : e
        })}
        otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload video
          </Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
  {form.video ? (
   <Video
   source={{ uri: form.video.uri }}
   style={{ width: '100%', height: 256, borderRadius: 16 }}
   useNativeControls
   resizeMode="cover"
   isLooping
   allowsFullscreen
   shouldPlay
 />
  ) : (
    <View
      style={{
        width: '100%',
        height: 160,
        paddingHorizontal: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: '#ffcc00',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={icons.upload}
          style={{ width: '50%', height: '50%', resizeMode: 'contain' }}
        />
      </View>
    </View>
  )}
</TouchableOpacity>

        </View>
        <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={()=> openPicker('image')}>
            {
            form.thumbnail ? (
              <Image 
              source={{ uri: form.thumbnail.uri}}
              className="w-full h-64 rounded-2xl"
              resizeMode= 'cover'
              />
            ):(
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center
               border-2 border-black-200 flex-row space-x-2">
                  <Image source={icons.upload} className="w-5 h-5" resizeMode='contain'/>
                  <Text className="text-sm text-gray-100 font-pmedium pl-2">
                    Choose a file
                  </Text>
              </View>
            )
          }
          </TouchableOpacity>
        </View>
        <FormField
        title="AI prompt"
        value={form.prompt}
        placeholder="The prompt you used to create this video"
        handleChangeText={(e)=> setForm({
          prompt : e
        })}
        otherStyles="mt-7"
        />
        <CustomButton title="Submit & Publish" 
        // handlePress={submit}
        containerStyles="mt-7"
        isLoading={uploading}
        />
      </ScrollView>
          </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({})