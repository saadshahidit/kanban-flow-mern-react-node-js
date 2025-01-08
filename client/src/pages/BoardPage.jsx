import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar.jsx';
import KanbanColumn from '../components/KanbanColumn.jsx';
import TaskModal from '../components/TaskModal.jsx';
import api from '../api/axios.js';

const STATUSES = ['todo', 'inprogress', 'done'];

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [boardTitle, setBoardTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  useEffect(() => {
    fetchBoard();
    fetchTasks();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBoard = async () => {
    try {
      const { data } = await api.get('/boards');
      const board = data.find((b) => b._id === id);
      if (board) setBoardTitle(board.title);
    } catch {
      /* ignore — title is cosmetic */
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const newStatus = destination.droppableId;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggableId ? { ...t, status: newStatus, order: destination.index } : t
      )
    );

    try {
      await api.patch(`/tasks/${draggableId}/move`, {
        status: newStatus,
        order: destination.index,
      });
    } catch {
      toast.error('Failed to move task — reverting');
      fetchTasks();
    }
  };

  // ── Modal handlers ────────────────────────────────────────────────────────
  const openCreate = (status) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editingTask) {
        const { data } = await api.put(`/tasks/${editingTask._id}`, formData);
        setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
        toast.success('Task updated');
      } else {
        const { data } = await api.post('/tasks', { ...formData, boardId: id });
        setTasks((prev) => [...prev, data]);
        toast.success('Task created');
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to save task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-indigo-600 transition"
          >
            ← Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="font-bold text-gray-800 text-lg">{boardTitle || 'Board'}</h1>
        </div>

        {loading ? (
          <div className="text-center py-24 text-gray-400">Loading board…</div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-6">
              {STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={getColumnTasks(status)}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onAddTask={openCreate}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={handleModalSubmit}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
