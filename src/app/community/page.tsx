'use client';
import { useEffect, useState, useOptimistic } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type CommunityPost, type UserProfile } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { createPost, likePost } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const postSchema = z.object({
  content: z.string().min(1, "Post cannot be empty.").max(500, "Post cannot exceed 500 characters."),
});

type PostWithOptimisticLike = CommunityPost & { isLikedOptimistic?: boolean; likesCountOptimistic?: number };

export default function CommunityPage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [optimisticPosts, setOptimisticPosts] = useOptimistic<PostWithOptimisticLike[], { postId: string, user: UserProfile }>(
    posts.map(p => ({ ...p, isLikedOptimistic: p.likes.includes(user?.uid || ''), likesCountOptimistic: p.likes.length })),
    (state, { postId, user }) => {
      return state.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(user.uid);
          return {
            ...post,
            isLikedOptimistic: !isLiked,
            likesCountOptimistic: isLiked ? post.likes.length - 1 : post.likes.length + 1,
          };
        }
        return post;
      });
    }
  );
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { content: '' },
  });

  useEffect(() => {
    const q = query(collection(db, 'community'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost));
      setPosts(postsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching community posts:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch community posts.' });
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const handleCreatePost = async (values: z.infer<typeof postSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated', description: 'You must be logged in to post.' });
      return;
    }
    form.reset();
    await createPost(values.content);
  };
  
  const handleLike = async (postId: string) => {
    if (!user) return;
    setOptimisticPosts({ postId, user });
    await likePost(postId);
  };

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('');

  if (loading) {
     return <div className="container mx-auto max-w-3xl py-10 px-4">
       <Skeleton className="h-24 w-full mb-8"/>
       <div className="space-y-6">
         {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
       </div>
     </div>;
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Community Feed</h1>
        <p className="text-muted-foreground mt-2 text-lg">Share insights, ask questions, and connect with peers.</p>
      </header>

      {user && (
        <Card className="mb-8 shadow-md">
          <CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreatePost)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea {...field} placeholder="What's on your mind?" className="min-h-[100px] text-base" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Post
                  </Button>
                </div>
              </form>
            </Form>
          </CardHeader>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
             <Card key={i} className="p-6"><Skeleton className="h-24 w-full" /></Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {optimisticPosts.map(post => {
            const isLiked = user ? post.isLikedOptimistic ?? post.likes.includes(user.uid) : false;
            const likesCount = post.likesCountOptimistic ?? post.likes.length;
            
            return (
              <Card key={post.id} className="shadow-sm">
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.userPhotoURL ?? undefined} />
                    <AvatarFallback>{getInitials(post.userDisplayName)}</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{post.userDisplayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 border-t pt-4">
                  <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)} disabled={!user}>
                    <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {likesCount}
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {post.commentCount}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
