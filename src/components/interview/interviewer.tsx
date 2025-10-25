'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSettings } from '@/context/settings-context';
import { chatWithInterviewer } from '@/ai/flows/interviewer-flow';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bot, Loader2, Send, User } from 'lucide-react';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function Interviewer() {
  const { isConfigured, apiKey, modelName } = useSettings();
  const [initialContext, setInitialContext] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleStartInterview = async () => {
    if (!initialContext.trim()) {
      setError('Please provide some context for the interview.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      const result = await chatWithInterviewer({
        context: initialContext,
        history: [],
        openRouterApiKey: apiKey,
        modelName: modelName,
      });
      setMessages([{ role: 'assistant', content: result.response }]);
      setInterviewStarted(true);
    } catch (e) {
      console.error(e);
      setError(
        'Failed to start the interview. Please check your settings and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: currentMessage },
    ];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await chatWithInterviewer({
        context: initialContext,
        history: newMessages,
        openRouterApiKey: apiKey,
        modelName: modelName,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: result.response }]);
    } catch (e) {
      console.error(e);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
       <Card>
          <CardContent className="pt-6">
             <div className="space-y-4">
                <Skeleton className="min-h-[200px] w-full" />
                <Skeleton className="h-10 w-32" />
             </div>
          </CardContent>
       </Card>
    )
  }

  if (!isConfigured) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Configuration needed</AlertTitle>
        <AlertDescription>
          Please{' '}
          <Link href="/settings" className="font-bold text-primary underline">
            configure your API key
          </Link>{' '}
          to start the interview.
        </AlertDescription>
      </Alert>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your resume, a job description, or a summary of the role here..."
                className="min-h-[200px] text-base"
                value={initialContext}
                onChange={(e) => setInitialContext(e.target.value)}
                disabled={isLoading}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleStartInterview}
                disabled={isLoading || !initialContext.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border rounded-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-prose p-3 rounded-lg whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                   <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
         {error && (
            <Alert variant="destructive" className='mb-4'>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="flex items-center gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Type your answer..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !currentMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
