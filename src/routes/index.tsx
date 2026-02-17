import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/selia/button';
import { Heading } from '@/components/selia/heading';
import { Separator } from '@/components/selia/separator';
import { Stack } from '@/components/selia/stack';
import {
  Item,
  ItemAction,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/selia/item';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '@/components/selia/menu';
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Header } from '@/components/header';

export const Route = createFileRoute('/')({ component: App });

function App() {
  return (
    <>
      <Header>
        <Heading>Prompts</Heading>
        <Button
          nativeButton={false}
          render={<Link to='/create'>Create Prompt</Link>}
        />
      </Header>
      <Separator className='my-6' />
      <Stack>
        {prompts.map((prompt) => (
          <Item key={prompt.id}>
            <ItemContent>
              <ItemTitle>{prompt.title}</ItemTitle>
              <ItemDescription>{prompt.description}</ItemDescription>
            </ItemContent>
            <ItemAction>
              <Button variant='outline' size='sm'>
                View
              </Button>
              <Menu>
                <MenuTrigger
                  render={
                    <Button variant='outline' size='sm-icon'>
                      <EllipsisVerticalIcon />
                    </Button>
                  }
                />
                <MenuPopup>
                  <MenuItem>
                    <PencilIcon /> Edit
                  </MenuItem>
                  <MenuItem className='text-danger'>
                    <Trash2Icon className='text-danger' /> Delete
                  </MenuItem>
                </MenuPopup>
              </Menu>
            </ItemAction>
          </Item>
        ))}
      </Stack>
    </>
  );
}

const prompts = [
  {
    id: '1',
    title: 'Create Snake Game',
    description:
      'Create a snake game using the latest and greatest technologies.',
  },
  {
    id: '2',
    title: 'Build Todo App',
    description:
      'Build a todo application with add, edit, and delete functionality.',
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description:
      'Create a weather dashboard that displays current conditions and forecast.',
  },
  {
    id: '4',
    title: 'E-commerce Store',
    description:
      'Build an e-commerce platform with product listing and cart functionality.',
  },
  {
    id: '5',
    title: 'Chat Application',
    description:
      'Develop a real-time chat application with user authentication.',
  },
  {
    id: '6',
    title: 'Blog Platform',
    description:
      'Create a blog platform with post creation, editing, and commenting.',
  },
  {
    id: '7',
    title: 'Task Management',
    description:
      'Build a task management tool with priority levels and due dates.',
  },
  {
    id: '8',
    title: 'Portfolio Website',
    description:
      'Design a personal portfolio website showcasing projects and skills.',
  },
  {
    id: '9',
    title: 'Fitness Tracker',
    description:
      'Create a fitness tracking app to log workouts and monitor progress.',
  },
  {
    id: '10',
    title: 'Music Player',
    description:
      'Build a music player with playlist management and audio controls.',
  },
];
