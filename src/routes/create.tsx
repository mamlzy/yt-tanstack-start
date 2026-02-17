import { Header } from '@/components/header';
import { Button } from '@/components/selia/button';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@/components/selia/field';
import { Form } from '@/components/selia/form';
import { Heading } from '@/components/selia/heading';
import { Input } from '@/components/selia/input';
import { Separator } from '@/components/selia/separator';
import { Textarea } from '@/components/selia/textarea';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

export const Route = createFileRoute('/create')({
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
      <Form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor='title'>Title</FieldLabel>
          <Input
            id='title'
            name='title'
            placeholder='Enter the form title'
            required
          />
          <FieldError match='valueMissing'>Title is Required</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor='content'>Prompt</FieldLabel>
          <FieldControl
            render={
              <Textarea
                id='content'
                name='content'
                placeholder='Enter the form title'
                required
              />
            }
          />
          <FieldError match='valueMissing'>Content is Required</FieldError>
        </Field>
        <Button type='submit'>Create Prompt</Button>
      </Form>
    </>
  );
}
