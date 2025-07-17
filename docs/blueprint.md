# **App Name**: Pravis Cognitive Platform

## Core Features:

- Smooth Scroll UX: Implement smooth scrolling using Lenis to enhance user experience. Ensure compatibility across devices.
- User Authentication: Implement basic user authentication using Firebase Auth. Allows users to sign-up and login.
- Cognitive Assessment Wizard: Display cognitive assessment tests as a wizard.  This series of screens prompts the user with cognitive-related questions and stores the results to the Cloud Firestore
- Content Display: Displays content from the 'content' collection on Firestore in reverse chronological order. Users can view and interact with content.
- Data Storage: Store cognitive assessment scores from users in Firebase Firestore.  Use different collections for different things (content, assessment, community)
- Personalized Feedback Generation: Implement the Gemini AI API to generate personalized content based on user data to give daily personalized feedback loops from cognitive tests, which uses the user scores as a tool to personalize recommendations .
- Community Feed: A community content feed allowing users to post and view content in reverse chronological order, and like or comment.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent intelligence, focus, and clarity, aligning with the cognitive enhancement aspect.
- Background color: A light gray (#F0F4F8) providing a clean and modern backdrop that does not distract from the content.
- Accent color: A bright orange (#FF9500) to highlight interactive elements and calls to action, creating a sense of energy and motivation.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, techy feel, ideal for headlines.
- Body font: 'Inter' (sans-serif) for readability and a clean, neutral aesthetic in body text.
- Use minimalist, geometric icons to represent various cognitive functions and content pillars, ensuring a consistent and modern visual language.
- Employ a clean, grid-based layout to organize content, ensuring a clear visual hierarchy and ease of navigation.
- Use subtle animations, such as smooth transitions and loading indicators, to enhance the user experience without causing distractions.