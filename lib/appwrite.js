import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '67b509520026106db332',
    databaseId: '67b50ae50001914c1014',
    userCollectionId: '67b50b0f003390132a35',
    videoCollectionId: '67b50b5700141980e782',
    storageId: '67b50cca001c95e801d8'
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

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
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
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
 
    export async function signIn(email, password){
        try {
            await account.deleteSession('current');
            const session = await account.createEmailPasswordSession(email,password);
            return session;
        } catch (error) {
            throw new Error(error);
          }
    }