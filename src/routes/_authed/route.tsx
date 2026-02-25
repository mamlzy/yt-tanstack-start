import { getCurrentUser, logout } from '@/auth';
import { Button } from '@/components/selia/button';
import { Separator } from '@/components/selia/separator';
import { Text } from '@/components/selia/text';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const user = await getCurrentUser();

    if (!user) {
      throw redirect({
        to: '/sign-in',
      });
    }

    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const logoutFn = useServerFn(logout);

  return (
    <div>
      <nav className='flex justify-between items-center'>
        <div className='font-semibold'>Prompt Manager</div>
        <div className='flex items-center gap-2'>
          <Text>Hello, {user.name}!</Text>
          <Button variant='danger' size='xs' onClick={() => logoutFn()}>
            Logout
          </Button>
        </div>
      </nav>
      <Separator className='my-6' />
      <Outlet />
    </div>
  );
}
