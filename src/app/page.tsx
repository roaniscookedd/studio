import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Cognitive Assessments',
      description: 'Engage in scientifically-designed tests to measure and understand your cognitive abilities.',
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-8 w-8 text-primary"
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 100-20z"></path>
          <path d="M12 18a6 6 0 100-12 6 6 0 100 12z"></path>
          <path d="M12 12v.01"></path>
        </svg>
      ),
      title: 'Personalized AI Feedback',
      description: 'Receive AI-driven insights and recommendations tailored to your unique cognitive profile.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Daily Performance Gains',
      description: 'Access a suite of tools and content designed to deliver measurable improvements in your daily performance.',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-full py-24 md:py-32 lg:py-40 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
            Unlock Your Cognitive Potential
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-6">
            Pravis is the infrastructure for cognitive enhancement—a suite that turns raw human potential into measurable, daily performance gains.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold">
              <Link href="/assessment">Take Assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-28 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-center font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Engineer the Future of Your Mind
          </h2>
          <p className="mx-auto max-w-[700px] text-center text-foreground/70 md:text-lg mt-4">
            A new era of human consciousness is here. It’s personalized, data-driven, and accessible to everyone.
          </p>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="font-headline mt-4 text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-foreground/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Join a Community</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Connect and Grow Together</h2>
                <p className="max-w-[600px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our vibrant community feed is a place to share insights, discuss strategies, and support each other on your cognitive enhancement journeys.
                </p>
                <Button asChild size="lg">
                    <Link href="/community">
                        Explore The Feed
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <div className="flex justify-center">
                <img
                    alt="Community Feed"
                    className="overflow-hidden rounded-xl object-cover"
                    height="400"
                    src="https://placehold.co/600x400"
                    data-ai-hint="community discussion"
                    width="600"
                />
            </div>
        </div>
      </section>
    </div>
  );
}
