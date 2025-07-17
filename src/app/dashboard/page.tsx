'use client'

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Content } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [content, setContent] = useState<Content[]>([]);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        if(user) {
            const fetchContent = async () => {
                try {
                    const contentRef = collection(db, 'content');
                    const q = query(contentRef, orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(q);
                    const contentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
                    setContent(contentData);
                } catch (error) {
                    console.error("Error fetching content:", error);
                } finally {
                    setIsLoadingContent(false);
                }
            };
            fetchContent();
        }
    }, [user]);

    if (loading || !user) {
        return (
             <div className="container mx-auto py-10 px-4">
                 <div className="space-y-4 mb-8">
                     <Skeleton className="h-12 w-1/2" />
                     <Skeleton className="h-6 w-3/4" />
                 </div>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-8 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-24 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                 </div>
             </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">Welcome, {user.displayName || 'User'}!</h1>
                <p className="text-muted-foreground mt-2 text-lg">Here's your daily content to enhance your cognitive abilities.</p>
            </div>

            {isLoadingContent ? (
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-8 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-24 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            ) : content.length === 0 ? (
                <Card className="text-center py-20">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">No Content Yet</CardTitle>
                        <CardDescription>Check back later for new content, or start with a cognitive assessment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/assessment">Take an Assessment</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {content.map(item => (
                        <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                             {item.imageUrl && (
                                <div className="relative h-48 w-full">
                                    <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" data-ai-hint="abstract technology" />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="font-headline text-xl mb-2">{item.title}</CardTitle>
                                    <Badge variant="secondary">{item.pillar}</Badge>
                                </div>
                                <CardDescription>{format(item.createdAt.toDate(), 'MMMM d, yyyy')}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground line-clamp-3">{item.body}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
