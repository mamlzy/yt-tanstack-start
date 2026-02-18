import { Header } from '@/components/header';
import { PromptForm } from '@/components/prompt-form';
import { Button } from '@/components/selia/button';
import { Heading } from '@/components/selia/heading';
import { Separator } from '@/components/selia/separator';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react';
import * as z from 'zod';
import { db } from '@/database/db';
import { promptTable } from '@/database/schema';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert';

const promptInputSchema = z.object({
  title: z.string().min(1).max(50),
  content: z.string().min(1),
});

const createPrompt = createServerFn({ method: 'POST' })
  .inputValidator(promptInputSchema)
  .handler(async ({ data }) => {
    await db.insert(promptTable).values({
      title: data.title,
      content: data.content,
    });

    throw redirect({ to: '/' });
  });

export const Route = createFileRoute('/create')({
  component: RouteComponent,
});

function RouteComponent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createPromptFn = useServerFn(createPrompt);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setError(null);

    try {
      setLoading(true);
      await createPromptFn({
        data: {
          title: formData.get('title') as string,
          content: formData.get('content') as string,
        },
      });
    } catch (error) {
      console.log('error =>', error);
      setError('Failed to create prompt, Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>
        <Heading>Create Prompt</Heading>
        <Button
          variant='secondary'
          nativeButton={false}
          render={
            <Link to='/'>
              <ArrowLeftIcon /> Back
            </Link>
          }
        />
      </Header>
      <Separator className='my-6' />
      {error && (
        <Alert variant='danger' className='mb-6'>
          <XCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <PromptForm onSubmit={handleSubmit} loading={loading} />
    </>
  );
}
