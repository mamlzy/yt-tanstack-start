import { Button } from '@/components/selia/button';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@/components/selia/field';
import { Form } from '@/components/selia/form';
import { Input } from '@/components/selia/input';
import { Textarea } from '@/components/selia/textarea';

export function PromptForm({
  onSubmit,
  data,
}: React.ComponentProps<typeof Form> & {
  data?: {
    title?: string;
    content?: string;
  };
}) {
  return (
    <Form onSubmit={onSubmit}>
      <Field>
        <FieldLabel htmlFor='title'>Title</FieldLabel>
        <Input
          id='title'
          name='title'
          placeholder='Enter the form title'
          defaultValue={data?.title}
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
              placeholder='Enter the form content'
              defaultValue={data?.content}
              required
            />
          }
        />
        <FieldError match='valueMissing'>Content is Required</FieldError>
      </Field>
      <Button type='submit'>
        {data?.title ? 'Update Prompt' : 'Create Prompt'}
      </Button>
    </Form>
  );
}
