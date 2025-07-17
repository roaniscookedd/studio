'use client'

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { submitAssessment } from './actions';
import { Loader2, Zap, Brain, Eye, Sparkles } from 'lucide-react';
import { type PersonalizedFeedbackOutput } from '@/ai/flows/personalized-feedback';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type FormData = {
  memory: string[];
  attention: string;
  reasoning: string;
};

const totalSteps = 5;

export default function AssessmentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<PersonalizedFeedbackOutput | null>(null);

  const methods = useForm<FormData>({ defaultValues: { memory: [], attention: '', reasoning: '' } });
  const { handleSubmit, register, watch } = methods;

  if (!authLoading && !user) {
    router.push('/login?redirect=/assessment');
    return null;
  }

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const feedback = await submitAssessment(data);
      setResults(feedback);
      setStep(totalSteps);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Submission failed', description: 'Could not submit your assessment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="text-center">
            <CardHeader>
              <Zap className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="font-headline text-2xl mt-4">Cognitive Assessment</CardTitle>
              <CardDescription>This short assessment will test your memory, attention, and reasoning skills. Find a quiet place and do your best!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={nextStep} size="lg">Start Assessment</Button>
            </CardContent>
          </Card>
        );
      case 2: // Memory
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2"><Brain className="h-6 w-6 text-primary" /><CardTitle className="font-headline">Memory Test</CardTitle></div>
                    <CardDescription>Memorize the following words. You will be asked to recall them later.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-lg font-semibold text-center bg-secondary p-6 rounded-md">
                        <p>Ocean</p><p>Forest</p><p>Mountain</p><p>River</p><p>Desert</p><p>Valley</p>
                    </div>
                    <Button onClick={nextStep} className="mt-6 w-full">I've memorized them</Button>
                </CardContent>
            </Card>
        );
      case 3: // Attention
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2"><Eye className="h-6 w-6 text-primary" /><CardTitle className="font-headline">Attention Test</CardTitle></div>
                    <CardDescription>Which shape is different from the others?</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup name="attention" onValueChange={(value) => methods.setValue('attention', value)}>
                        <div className="grid grid-cols-3 gap-4">
                            {['circle', 'circle', 'square', 'circle', 'circle', 'circle'].map((shape, i) => (
                                <Label key={i} htmlFor={`shape-${i}`} className="flex items-center justify-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">
                                    <RadioGroupItem value={shape} id={`shape-${i}`} className="sr-only" />
                                    {shape === 'circle' ? <div className="h-12 w-12 rounded-full bg-muted-foreground" /> : <div className="h-12 w-12 rounded-md bg-muted-foreground" />}
                                </Label>
                            ))}
                        </div>
                    </RadioGroup>
                    <Button onClick={nextStep} disabled={!watch('attention')} className="mt-6 w-full">Next</Button>
                </CardContent>
            </Card>
        );
      case 4: // Reasoning & Memory Recall
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" /><CardTitle className="font-headline">Reasoning & Recall</CardTitle></div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="font-semibold">If all Zigs are Zags, and some Zags are Zogs, are all Zigs definitely Zogs?</Label>
                    <RadioGroup name="reasoning" onValueChange={(value) => methods.setValue('reasoning', value)} className="mt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="r1" /><Label htmlFor="r1">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="r2" /><Label htmlFor="r2">No</Label></div>
                    </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="memory-recall" className="font-semibold">Recall the words from the memory test. Type as many as you can remember, separated by commas.</Label>
                  <Input id="memory-recall" placeholder="e.g. word1, word2, ..." {...register('memory')} className="mt-2" />
                </div>

                <Button type="submit" disabled={isSubmitting || !watch('reasoning')} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Assessment
              </Button>
            </CardContent>
          </Card>
        );
        case 5: // Results
        if (isSubmitting) {
            return (
              <Card className="text-center p-10">
                <CardHeader>
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <CardTitle className="font-headline text-2xl mt-4">Analyzing your results...</CardTitle>
                  <CardDescription>Our AI is generating your personalized feedback. This might take a moment.</CardDescription>
                </CardHeader>
              </Card>
            );
          }
          if (results) {
            return (
              <Card className="shadow-2xl">
                <CardHeader className="text-center bg-secondary">
                  <Sparkles className="mx-auto h-12 w-12 text-primary" />
                  <CardTitle className="font-headline text-3xl mt-4">Your Personalized Feedback</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h3 className="font-headline text-xl text-primary mb-2">Feedback</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{results.feedback}</p>
                    </div>
                    <div className="border-t pt-6">
                        <h3 className="font-headline text-xl text-primary mb-2">Recommendations</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{results.recommendations}</p>
                    </div>
                    <Button onClick={() => router.push('/dashboard')} className="w-full">Back to Dashboard</Button>
                </CardContent>
              </Card>
            );
          }
        return null; // Should not be reached
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6">
          {step > 1 && step < 5 && <Progress value={(step / totalSteps) * 100} className="mb-8" />}
          {renderStep()}
          {step > 1 && step < 4 && (
             <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
