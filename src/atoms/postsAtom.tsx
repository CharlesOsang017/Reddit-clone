import { Timestamp } from 'firebase/firestore';
import {atom} from 'recoil';

export interface Post {
    creatorId: string | undefined;
    id: string;
    communityId: string;
    creatorDisplayName: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    imageURL?: string;
    communityImageURL?: string;
    createdAt: Timestamp
}

export  interface PostVote {
    id: string;
    postId: string;
    communityId: string;
    voteValue: number;
}
interface PostState {
    selectedPost: Post | null;
    posts: Post[];
    postVotes: PostVote[]
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
    postVotes: []
}
export const PostState = atom<PostState>({
    key: 'postState',
    default: defaultPostState,
}) 