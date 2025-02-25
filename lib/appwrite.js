import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '67b509520026106db332',
    databaseId: '67b50ae50001914c1014',
    userCollectionId: '67b50b0f003390132a35',
    videoCollectionId: '67b50b5700141980e782',
    storageId: '67b50cca001c95e801d8'
}

const{
  endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = appwriteConfig;
const client = new Client();

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

  export const createUser = async (email, password, username)=>{
      try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
    )
    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
       userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar : avatarUrl
        }
    )
    return newUser;
      } catch (error) {
        console.log(error);
        throw new Error(error);
        
      }
    }
 
    export const signIn = async(email, password) => {
        try {
            // await account.deleteSession('current');
            const session = await account.createEmailPasswordSession(email,password);
            return session;
        } catch (error) {
            throw new Error(error);
          }
    }

    export const getCurrentUser = async () =>{
      try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
          databaseId,
          userCollectionId,
          [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
      } catch (error) {
        console.log(error);
      }
    }
    export const getAllPosts = async () =>{
      try {
        const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
        );
      return posts.documents;
      } catch (error) {
        throw new Error(error);
      }
    }
    export const getLatestPosts = async () =>{
      try {
        const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [Query.orderDesc('$createdAt',Query.limit(7))]
        );
      return posts.documents;
      } catch (error) {
        throw new Error(error);
      }
    }
    export const getSearchPosts = async (query) =>{
      try {
        const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [Query.search('title',query)]
        );
      return posts.documents;
      } catch (error) {
        throw new Error(error);
      }
    } 
    export const getUserPosts = async (userId) =>{
      try {
        const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId,
          [Query.equal('users', userId)]
        );
      return posts.documents;
      } catch (error) {
        throw new Error(error);
      }
    }
    export const signOut = async () =>{
      try {
      const session = await account.deleteSessions('current');
      return session;
      } catch (error) {
        throw new Error(error);
      }
    }

    export const getFilePreview = async (fileId, type) =>{
      let fileUrl;

      try {
      if(type === 'video'){
        fileUrl = storage.getFileView(storageId, fileId)
      }else if(type === 'image'){
        fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)

      }else{
        throw new Error('invalid file type');
      }
      if(!fileUrl) throw Error;
      return fileUrl;
      } catch (error) {
        throw new Error(error);
      }
    }

    export const uploadFile = async (file, type) =>{
      if(!file) return;
      const {mimeType, ...rest} = file;
      const asset = {type: mimeType, ...rest};
      try {
      const uploadedFile = await storage.createFile(
        storageId,
        ID.unique(),
        asset
      );
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
      } catch (error) {
        throw new Error(error);
      }
    }

    export const createVideo = async (form) =>{
      try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, 'image'),
        uploadFile(form.video, 'video')
      ])
      const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId
      })
      return newPost;
      } catch (error) {
        throw new Error(error);
      }
    }