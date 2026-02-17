import { Header } from '@/components/header';
import { Button } from '@/components/selia/button';
import { Heading } from '@/components/selia/heading';
import { Separator } from '@/components/selia/separator';
import { Text } from '@/components/selia/text';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

export const Route = createFileRoute('/view/$promptId')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();

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
        Prompt Title
      </Heading>
      <Text className='text-2xl font-medium mb-8'>Create Javascript Game</Text>
      <Heading size='sm' level={2} className='text-dimmed'>
        Prompt
      </Heading>
      <Text className='font-medium mb-8'>
        Create a snake game using the latest and greatest technologies.
      </Text>
      <Heading size='sm' level={2} className='text-dimmed'>
        Created At
      </Heading>
      <Text>3 days ago</Text>
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
        <Button variant='danger' block>
          Delete
        </Button>
      </footer>
    </>
  );
}
