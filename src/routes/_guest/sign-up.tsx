import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { Button } from '@/components/selia/button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/selia/card';
import { Input } from '@/components/selia/input';
import { Field, FieldError, FieldLabel } from '@/components/selia/field';
import { Text, TextLink } from '@/components/selia/text';
import { Form } from '@/components/selia/form';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import * as z from 'zod';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/selia/alert';
import { XCircleIcon } from 'lucide-react';
import { db } from '@/database/db';
import bcrypt from 'bcryptjs';
import { userTable } from '@/database/schema';
import { useAppSession } from '@/lib/session';

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUp = createServerFn({ method: 'POST' })
  .inputValidator(signUpSchema)
  .handler(async ({ data }) => {
    const existingEmail = await db.query.userTable.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingEmail) {
      return {
        error: 'User already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const [newUser] = await db
      .insert(userTable)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      .returning();

    const session = await useAppSession();
    await session.update({
      userId: newUser.id,
    });

    throw redirect({
      to: '/',
    });
  });

export const Route = createFileRoute('/_guest/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  const signUpFn = useServerFn(signUp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setError(null);

    try {
      setLoading(true);
      const signUpRes = await signUpFn({
        data: {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        },
      });

      if (signUpRes?.error) {
        setError(signUpRes.error);
      }
    } catch (error) {
      console.log('error =>', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full lg:w-5/12 xl:w-md'>
      <CardHeader align='center'>
        <CardTitle>Create an account</CardTitle>
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
          <Button
            type='submit'
            variant='primary'
            size='lg'
            block
            progress={loading}
          >
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
