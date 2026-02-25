import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { Button } from '@/components/selia/button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/selia/card';
import { Input } from '@/components/selia/input';
import { Field, FieldError, FieldLabel } from '@/components/selia/field';
import { Text, TextLink } from '@/components/selia/text';
import { Form } from '@/components/selia/form';
import * as z from 'zod';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { authenticate } from '@/auth';
import { useAppSession } from '@/lib/session';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert';
import { XCircleIcon } from 'lucide-react';

const signInInputSchema = z.object({
  email: z.email(''),
  password: z.string().min(8),
});

const signIn = createServerFn({ method: 'POST' })
  .inputValidator(signInInputSchema)
  .handler(async ({ data }) => {
    const authUser = await authenticate(data.email, data.password);

    if (!authUser) {
      return {
        error: 'Invalid email or password',
      };
    }

    const session = await useAppSession();
    await session.update({
      userId: authUser.id,
    });

    throw redirect({ to: '/' });
  });

export const Route = createFileRoute('/_guest/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  const signInFn = useServerFn(signIn);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setError(null);

    try {
      setLoading(true);

      const signInRes = await signInFn({
        data: {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        },
      });

      if (signInRes?.error) {
        setError(signInRes.error);
      }
    } catch (error) {
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full lg:w-5/12 xl:w-md'>
      <CardHeader align='center'>
        <CardTitle>Sign in to your account</CardTitle>
      </CardHeader>
      <CardBody className='flex flex-col gap-5'>
        {error && (
          <Alert variant='danger' className='mb-6'>
            <XCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
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
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              required
            />
            <FieldError match='valueMissing'>Password is required</FieldError>
          </Field>
          <Button
            type='submit'
            variant='primary'
            size='lg'
            block
            progress={loading}
          >
            Sign In
          </Button>
          <Text className='text-center'>
            Don't have an account?{' '}
            <TextLink render={<Link to='/sign-up'>Sign up</Link>} />
          </Text>
        </Form>
      </CardBody>
    </Card>
  );
}
