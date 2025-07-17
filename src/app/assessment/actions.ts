'use server';

import { auth, db } from '@/lib/firebase';
import { generatePersonalizedFeedback, type PersonalizedFeedbackOutput } from '@/ai/flows/personalized-feedback';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

type FormData = {
    memory: string | string[];
    attention: string;
    reasoning: string;
};

const correctMemoryWords = ['ocean', 'forest', 'mountain', 'river', 'desert', 'valley'];
const correctAttentionShape = 'square';
const correctReasoningAnswer = 'no';

export async function submitAssessment(data: FormData): Promise<PersonalizedFeedbackOutput> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to submit an assessment.');
  }

  // 1. Calculate scores
  const memoryWords = typeof data.memory === 'string' 
    ? data.memory.split(',').map(w => w.trim().toLowerCase()) 
    : [];

  const memoryScore = memoryWords.reduce((score, word) => {
    return correctMemoryWords.includes(word) ? score + 1 : score;
  }, 0);

  const attentionScore = data.attention === correctAttentionShape ? 1 : 0;
  const reasoningScore = data.reasoning === correctReasoningAnswer ? 1 : 0;
  
  const scores = {
    memory: (memoryScore / correctMemoryWords.length) * 100,
    attention: attentionScore * 100,
    reasoning: reasoningScore * 100,
  };

  // 2. Save initial assessment to Firestore
  const assessmentRef = await addDoc(collection(db, 'assessments'), {
    userId: user.uid,
    scores,
    createdAt: serverTimestamp(),
    feedback: '',
    recommendations: '',
  });

  // 3. Generate personalized feedback using GenAI
  const feedbackInput = { scores };
  const personalizedFeedback = await generatePersonalizedFeedback(feedbackInput);
  
  // 4. Update the assessment document with the generated feedback
  await updateDoc(doc(db, 'assessments', assessmentRef.id), {
      feedback: personalizedFeedback.feedback,
      recommendations: personalizedFeedback.recommendations,
  });

  return personalizedFeedback;
}
