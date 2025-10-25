import { SettingsForm } from '@/components/settings/settings-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-headline font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>OpenRouter Configuration</CardTitle>
          <CardDescription>
            Configure your OpenRouter API key and model to power the AI features.
            You can get your API key from{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              OpenRouter
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
