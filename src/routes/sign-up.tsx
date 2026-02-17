import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/selia/button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/selia/card';
import { Input } from '@/components/selia/input';
import { Field, FieldError, FieldLabel } from '@/components/selia/field';
import { Text, TextLink } from '@/components/selia/text';
import { Form } from '@/components/selia/form';

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    console.log(
      formData.get('name'),
      formData.get('email'),
      formData.get('password'),
    );
  };

  return (
    <Card className='w-full lg:w-5/12 xl:w-md'>
      <CardHeader align='center'>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardBody className='flex flex-col gap-5'>
        <Form onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor='name'>Name</FieldLabel>
            <Input
              id='name'
              type='name'
              name='name'
              placeholder='Enter your name'
              required
            />
            <FieldError match='valueMissing'>Name is required</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input
              id='email'
              type='email'
              name='email'
              placeholder='Enter your email'
              required
            />
            <FieldError match='valueMissing'>Email is required</FieldError>
            <FieldError match='typeMismatch'>Invalid email address</FieldError>
          </Field>
          <Field>
            <div className='flex items-center'>
              <FieldLabel htmlFor='password'>Password</FieldLabel>
              <TextLink href='#' className='ml-auto'>
                Forgot password?
              </TextLink>
            </div>
            <Input
              id='password'
              type='password'
              name='password'
              placeholder='Enter your password'
              required
            />
            <FieldError match='valueMissing'>Password is required</FieldError>
          </Field>
          <Button type='submit' variant='primary' block size='lg'>
            Sign Up
          </Button>
          <Text className='text-center'>
            Already have an account?{' '}
            <TextLink render={<Link to='/sign-in'>Sign in</Link>} />
          </Text>
        </Form>
      </CardBody>
    </Card>
  );
}
