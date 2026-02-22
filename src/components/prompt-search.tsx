import { InputGroup, InputGroupAddon } from '@/components/selia/input-group';
import { Input } from '@/components/selia/input';
import { Text } from '@/components/selia/text';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/selia/button';
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const Route = getRouteApi('/');

export function PromptSearch() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(search.query || '');
  }, [search.query]);

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = e.currentTarget.query.value;

    navigate({
      to: '/',
      search: {
        query,
      },
    });
  };

  return (
    <form className='mb-6' onSubmit={handleSearch}>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <Input
          placeholder='Search prompt...'
          name='query'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <InputGroupAddon align='end'>
          <Button type='submit' variant='secondary'>
            Search
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {search.query && (
        <Text className='text-muted mt-2'>
          Result for "{search.query}".{' '}
          <Link
            to='/'
            search={{
              query: undefined,
            }}
            className='underline'
          >
            Clear Search
          </Link>
        </Text>
      )}
    </form>
  );
}
