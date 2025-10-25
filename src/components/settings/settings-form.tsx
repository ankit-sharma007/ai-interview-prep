'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/context/settings-context';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const formSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required.'),
  modelName: z.string().min(1, 'Model name is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function SettingsForm() {
  const { apiKey, modelName, setApiKey, setModelName } = useSettings();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
      modelName: '',
    },
  });

  useEffect(() => {
    if (apiKey || modelName) {
      form.reset({
        apiKey: apiKey,
        modelName: modelName,
      });
    }
  }, [apiKey, modelName, form]);

  function onSubmit(values: FormValues) {
    setApiKey(values.apiKey);
    setModelName(values.modelName);
    toast({
      title: 'Settings saved',
      description: 'Your OpenRouter configuration has been updated.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenRouter API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="sk-or-..." {...field} />
              </FormControl>
              <FormDescription>
                Your secret API key for OpenRouter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., openai/gpt-4o" {...field} />
              </FormControl>
              <FormDescription>
                The model you want to use from OpenRouter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  );
}
