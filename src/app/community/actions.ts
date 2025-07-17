'use server';

import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function createPost(content: string) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to create a post.');
  }

  await addDoc(collection(db, 'community'), {
    userId: user.uid,
    userDisplayName: user.displayName,
    userPhotoURL: user.photoURL,
    content: content,
    likes: [],
    commentCount: 0,
    createdAt: serverTimestamp(),
  });

  revalidatePath('/community');
}

export async function likePost(postId: string) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('You must be logged in to like a post.');
    }

    const postRef = doc(db, 'community', postId);
    const postSnap = await getDoc(postRef);

    if(!postSnap.exists()) {
        throw new Error('Post not found.');
    }

    const postData = postSnap.data();
    const isLiked = postData.likes.includes(user.uid);

    if (isLiked) {
        await updateDoc(postRef, {
            likes: arrayRemove(user.uid)
        });
    } else {
        await updateDoc(postRef, {
            likes: arrayUnion(user.uid)
        });
    }

    revalidatePath('/community');
}
