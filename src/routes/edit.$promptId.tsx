import { Header } from '@/components/header';
import { PromptForm } from '@/components/prompt-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert';
import { Button } from '@/components/selia/button';
import { Heading } from '@/components/selia/heading';
import { Separator } from '@/components/selia/separator';
import { db } from '@/database/db';
import { promptTable } from '@/database/schema';
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { eq } from 'drizzle-orm';
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';

const getPromptInputSchema = z.object({
  promptId: z.uuid(),
});

const getPrompt = createServerFn()
  .inputValidator(getPromptInputSchema)
  .handler(async ({ data }) => {
    const prompt = await db.query.promptTable.findFirst({
      where: {
        id: data.promptId,
      },
    });

    return prompt;
  });

const updatePromptInputSchema = z.object({
  promptId: z.uuid(),
  title: z.string().min(1).max(50),
  content: z.string().min(1),
});

const updatePrompt = createServerFn({ method: 'POST' })
  .inputValidator(updatePromptInputSchema)
  .handler(async ({ data }) => {
    await db
      .update(promptTable)
      .set({
        title: data.title,
        content: data.content,
      })
      .where(eq(promptTable.id, data.promptId));

    throw redirect({
      to: '/view/$promptId',
      params: {
        promptId: data.promptId,
      },
    });
  });

export const Route = createFileRoute('/edit/$promptId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const prompt = await getPrompt({ data: { promptId: params.promptId } });

    if (!prompt) {
      throw notFound();
    }

    return { prompt };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `Edit: ${loaderData?.prompt.title || 'Prompt'}`,
      },
    ],
  }),
  notFoundComponent: () => (
    <div>
      Prompt not found.{' '}
      <Link to='/' className='underline'>
        Back to home.
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className='text-danger'>Something went wrong.</div>
  ),
});

function RouteComponent() {
  const params = Route.useParams();
  const { prompt } = Route.useLoaderData();
  const updatePromptFn = useServerFn(updatePrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setError(null);

    try {
      setLoading(true);
      await updatePromptFn({
        data: {
          title: formData.get('title') as string,
          content: formData.get('content') as string,
          promptId: params.promptId,
        },
      });
    } catch (error) {
      setError('Failed to update prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header>
        <Heading>Edit Prompt</Heading>
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
      <PromptForm
        onSubmit={handleSubmit}
        loading={loading}
        data={{
          title: prompt?.title,
          content: prompt?.content,
        }}
      />
    </>
  );
}
