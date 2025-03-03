'use client';

import { Checkbox, IconButton, Spinner } from '@material-tailwind/react';
import { deleteTodo, TodoRow, updateTodo } from 'actions/todo-actions';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { queryClient } from 'config/react-query-client-provider';
import { formatDate } from 'utils/foramt-data';

export default function ToDo({ todo }: { todo: TodoRow }) {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed);
  const [title, setTitle] = useState(todo.title);
  const [completedAt, setCompletedAt] = useState(todo.completed_at);

  const updateTodoMutation = useMutation({
    mutationFn: () =>
      updateTodo({
        id: todo.id,
        title,
        completed,
        completed_at: completedAt,
      }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  });

  return (
    <div className="flex items-center w-full gap-1.5 relative">
      <Checkbox
        checked={completed}
        onChange={(e) => {
          setCompleted(e.target.checked);
          setCompletedAt(e.target.checked ? new Date().toISOString() : null);
          updateTodoMutation.mutate();
        }}
      />
      {isEditing ? (
        <input
          className="flex-1 border-black border-b pb-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <div className="flex-1">
          <p className={`font-medium ${completed && 'line-through'}`}>
            {title}
          </p>
          <div className="text-xs text-blue-gray-400">
            {!completed && `Created: ${formatDate(todo.created_at)}`}
            {completed && `Completed: ${formatDate(completedAt)}`}
          </div>
        </div>
      )}
      {isEditing ? (
        <IconButton onClick={() => updateTodoMutation.mutate()}>
          {updateTodoMutation.isPending ? (
            <Spinner />
          ) : (
            <i className="fas fa-check" />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={() => setIsEditing(true)}>
          <i className="fas fa-pen" />
        </IconButton>
      )}

      <IconButton onClick={() => deleteTodoMutation.mutate()}>
        {deleteTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className="fas fa-trash" />
        )}
      </IconButton>
    </div>
  );
}
