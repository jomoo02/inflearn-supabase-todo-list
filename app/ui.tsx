'use client';

import { Button, Input } from '@material-tailwind/react';
import ToDo from 'components/todo';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { createTodo, getTodos } from 'actions/todo-actions';

export default function UI() {
  const [searchInput, setSearchInput] = useState('');

  const todoQuery = useQuery({
    queryKey: ['todos', searchInput],
    queryFn: () => getTodos({ searchInput }),
  });

  const createTodoMutation = useMutation({
    mutationFn: () =>
      createTodo({
        title: 'New ToDo',
        completed: false,
      }),
    onSuccess: () => {
      todoQuery.refetch();
    },
  });

  return (
    <div className="w-2/3 mx-auto flex flex-col items-center py-10 gap-2.5">
      <h1 className="text-xl font-bold">TODO LIST</h1>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        label="Search TODO"
        placeholder="Search TODO"
        icon={<i className="fas fa-search" />}
      />

      {todoQuery.isPending && <p>Loading...</p>}
      {todoQuery.data &&
        todoQuery.data.map((todo) => <ToDo key={todo.id} todo={todo} />)}
      <Button
        onClick={() => createTodoMutation.mutate()}
        loading={createTodoMutation.isPending}
      >
        <i className="fas fa-plus mr-2" />
        Add TODO
      </Button>
    </div>
  );
}
