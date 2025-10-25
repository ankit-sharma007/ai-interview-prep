import { Interviewer } from '@/components/interview/interviewer';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">
          AI Interview Practice
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Paste your resume, a job description, or just tell us about the role
          you're interviewing for. The AI will then start asking you questions.
        </p>
      </div>
      <Interviewer />
    </div>
  );
}
