import { Header } from '@/components/header';
import { PromptForm } from '@/components/prompt-form';
import { Button } from '@/components/selia/button';
import { Heading } from '@/components/selia/heading';
import { Separator } from '@/components/selia/separator';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

export const Route = createFileRoute('/edit/$promptId')({
  component: RouteComponent,
});

function RouteComponent() {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    console.log(formData.get('title'), formData.get('content'));
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
      <PromptForm
        onSubmit={handleSubmit}
        data={{
          title: 'Prompt Title',
          content: 'Prompt Content',
        }}
      />
    </>
  );
}
