import { useState, useEffect } from 'react';
import FormField from './ui/FormField.jsx';
import Input, { Textarea, Select } from './ui/Input.jsx';
import Button from './ui/Button.jsx';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
};

export default function TaskModal({ isOpen, onClose, onSubmit, task, defaultStatus }) {
  const [form, setForm] = useState(EMPTY_FORM);

  // Populate form when editing an existing task or reset when creating
  useEffect(() => {
    if (!isOpen) return;
    if (task) {
      setForm({
        title: task.title ?? '',
        description: task.description ?? '',
        priority: task.priority ?? 'medium',
        status: task.status ?? 'todo',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm({ ...EMPTY_FORM, status: defaultStatus ?? 'todo' });
    }
  }, [task, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, dueDate: form.dueDate || null });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-lg">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <FormField label="Title" required>
            <Input
              type="text"
              value={form.title}
              onChange={set('title')}
              required
              placeholder="What needs to be done?"
              autoFocus
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={form.description}
              onChange={set('description')}
              rows={3}
              placeholder="Add more details (optional)"
            />
          </FormField>

          <div className="flex gap-4">
            <FormField label="Priority" className="flex-1">
              <Select value={form.priority} onChange={set('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormField>

            <FormField label="Status" className="flex-1">
              <Select value={form.status} onChange={set('status')}>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Due Date">
            <Input type="date" value={form.dueDate} onChange={set('dueDate')} />
          </FormField>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
