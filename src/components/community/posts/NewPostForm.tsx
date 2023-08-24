import { FunctionComponent, useState } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoImageOutline, IoDocumentText } from "react-icons/io5";
import { BiPoll } from "react-icons/bi";
import { Alert, Text, AlertIcon, AlertTitle, Flex, Icon } from "@chakra-ui/react";
import TabItem from "./TabItem";
import TextInputs from "./postForm/TextInputs";
import ImageUploads from "./postForm/ImageUploads";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { Post } from "@/atoms/postsAtom";
import useSelectFile from "@/hooks/useSelectFile";

const formTabs: TabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export interface NewPostFormProps {
    user: User;
    communityImageURL?: string;
}

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};
const NewPostForm: FunctionComponent<NewPostFormProps> = ({user, communityImageURL}) => {
    const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)  
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const {selectedFile, setSelectedFile, onSelectedFile} = useSelectFile();
  const handleCreatePost = async () => {
      const {communityId} = router.query;
    // create new object => type post
    const newPost: Post = {
        communityId: communityId as string,
        communityImageURL: communityImageURL || '',
        creatorId: user.uid,
        creatorDisplayName: user.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
    }
    setLoading(true)
   try {
     // store the post in db
     const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)

     //check for selectedFile
    if (selectedFile){
        // store in storge => getDownLoadURL (return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef)

        //update post doc by adding imageURL
        await updateDoc(postDocRef, {imageURL: downloadURL})
      }
      router.back()
   } catch (error: any) {
    console.log(error.message)
    setError(error)
   }
   setLoading(false)
   // redirect the user back to the communityPage using router
  };
   const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Flex direction='column' bg='white' borderRadius={4} mt={2}>
      <Flex width='100%'>
        {formTabs.map((item: any) => (
          <TabItem
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            loading={loading}
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUploads
            selectedFile={selectedFile}
            onSelectImage={onSelectedFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
        <AlertIcon />
        <Text mr={2}>Error occured when creting post</Text>
        
      </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
