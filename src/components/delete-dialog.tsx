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

export function DeleteDialog() {
  const beingDeleted = useDeleteStore((state) => state.beingDeleted);
  const setBeingDeleted = useDeleteStore((state) => state.setBeingDeleted);

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
          <AlertDialogClose
            render={<Button variant='danger'>Delete</Button>}
          ></AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
