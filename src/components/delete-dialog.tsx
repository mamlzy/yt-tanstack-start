import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@/components/selia/alert-dialog';
import { IconBox } from '@/components/selia/icon-box';
import { Strong } from '@/components/selia/text';
import { useDeleteStore } from '@/stores/delete-store';
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/selia/button';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import * as z from 'zod';
import { useState } from 'react';
import { toastManager } from './selia/toast';
import { db } from '@/database/db';
import { promptTable } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { redirect, useRouter } from '@tanstack/react-router';

const deletePromptInputSchema = z.object({
  promptId: z.uuid(),
});

export const deletePrompt = createServerFn({ method: 'POST' })
  .inputValidator(deletePromptInputSchema)
  .handler(async ({ data }) => {
    await db.delete(promptTable).where(eq(promptTable.id, data.promptId));
    throw redirect({
      to: '/',
    });
  });

export function DeleteDialog() {
  const deletePromptFn = useServerFn(deletePrompt);
  const beingDeleted = useDeleteStore((state) => state.beingDeleted);
  const setBeingDeleted = useDeleteStore((state) => state.setBeingDeleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!beingDeleted) return;

    try {
      setLoading(true);
      await deletePromptFn({ data: { promptId: beingDeleted.id } });
      toastManager.add({
        title: 'Prompt deleted',
        description: 'Prompt deleted successfully.',
        type: 'success',
      });
      router.invalidate();
    } catch (error) {
      toastManager.add({
        title: 'Error',
        description: 'Failed to delete prompt. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
      setBeingDeleted(null);
    }
  };

  return (
    <AlertDialog
      open={!!beingDeleted}
      onOpenChange={() => setBeingDeleted(null)}
    >
      <AlertDialogPopup>
        <AlertDialogHeader>
          <IconBox variant='danger'>
            <Trash2Icon />
          </IconBox>
          <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            Do you want to delete "<Strong>{beingDeleted?.title}</Strong>" this
            prompt?
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogClose>Cancel</AlertDialogClose>
          <Button
            variant='danger'
            progress={loading}
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
