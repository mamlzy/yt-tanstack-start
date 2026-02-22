import { Header } from '@/components/header';
import { Button } from '@/components/selia/button';
import { Heading } from '@/components/selia/heading';
import { Separator } from '@/components/selia/separator';
import { Text } from '@/components/selia/text';
import { db } from '@/database/db';
import { useDeleteStore } from '@/stores/delete-store';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { ArrowLeftIcon } from 'lucide-react';
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

export const Route = createFileRoute('/view/$promptId')({
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
        title: loaderData?.prompt.title || 'Prompt Details',
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

  const setBeingDeleted = useDeleteStore((state) => state.setBeingDeleted);

  return (
    <>
      <Header>
        <Heading>Prompt Details</Heading>
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
      <Heading size='sm' level={2} className='text-dimmed'>
        Title
      </Heading>
      <Text className='text-2xl font-medium mb-8'>{prompt?.title}</Text>
      <Heading size='sm' level={2} className='text-dimmed'>
        Prompt
      </Heading>
      <Text className='font-medium mb-8'>{prompt?.content}</Text>
      <Heading size='sm' level={2} className='text-dimmed'>
        Created At
      </Heading>
      <Text className='mb-8'>{prompt?.createdAt.toLocaleDateString()}</Text>
      <Heading size='sm' level={2} className='text-dimmed'>
        Updated At
      </Heading>
      <Text>{prompt?.updatedAt.toLocaleDateString()}</Text>
      <Separator className='my-6' />
      <footer className='flex gap-2'>
        <Button
          variant='outline'
          block
          nativeButton={false}
          render={
            <Link
              to='/edit/$promptId'
              params={{
                promptId: params.promptId,
              }}
            >
              Edit
            </Link>
          }
        ></Button>
        <Button
          variant='danger'
          block
          onClick={() => {
            setBeingDeleted({
              id: params.promptId,
              title: 'Create Javascript Game',
            });
          }}
        >
          Delete
        </Button>
      </footer>
    </>
  );
}
