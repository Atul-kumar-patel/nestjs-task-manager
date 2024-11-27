'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import api from '@/lib/api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
}

interface TaskFilter {
  status?: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  search?: string;
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.search) params.append('search', filter.search);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task created successfully');
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [isAuthenticated, isLoading, router, filter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nightBlue to-nightBlueShadow">
      {/* Header */}
      <header className="bg-nightBlueShadow/50 backdrop-blur-md border-b border-sandTan/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-sandTan">Task Manager</h1>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sandTan/50" />
            <input
              type="text"
              placeholder="Search tasks..."
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-nightBlueShadow/50 border border-sandTan/20 
              rounded-lg text-sandTan placeholder-sandTan/50 focus:ring-2 focus:ring-sandTan/30 
              focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={logout}
            className="px-6 py-2.5 bg-gradient-to-r from-sandTan to-sandTanShadow text-nightBlueShadow 
            rounded-lg hover:opacity-90 transition-all duration-300 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Filter and Create Task Button */}
        <div className="flex justify-between items-center mb-8">
          <select
            onChange={(e) => setFilter({ ...filter, status: e.target.value as Task['status'] })}
            className="px-4 py-2.5 bg-nightBlueShadow/50 border border-sandTan/20 rounded-lg 
            text-sandTan focus:ring-2 focus:ring-sandTan/30 focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <button
            onClick={() => document.getElementById('createTaskForm')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 bg-gradient-to-r from-sandTan to-sandTanShadow text-nightBlueShadow 
            rounded-lg hover:opacity-90 transition-all duration-300 font-medium flex items-center gap-2"
          >
            <FiPlus size={20} />
            Create Task
          </button>
        </div>

        {/* Task Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['OPEN', 'IN_PROGRESS', 'DONE'].map((status) => (
            <div key={status} 
              className="bg-nightBlueShadow/50 backdrop-blur-md rounded-xl border border-sandTan/10 
              flex flex-col h-[calc(100vh-24rem)]"
            >
              <div className="p-4 border-b border-sandTan/10">
                <h2 className="text-lg font-semibold text-sandTan flex items-center justify-between">
                  {status.replace('_', ' ')}
                  <span className="text-sm px-3 py-1 bg-sandTan/10 rounded-full">
                    {tasks.filter(task => task.status === status).length}
                  </span>
                </h2>
              </div>
              
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {tasks
                  .filter(task => task.status === status)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="group bg-nightBlue/50 rounded-lg p-4 hover:bg-nightBlue 
                      transition-all duration-300 border border-sandTan/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sandTan font-medium flex-1">{task.title}</h3>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-sandTan/50 hover:text-sandTan transition-colors duration-300"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sandTan/70 text-sm mb-3">{task.description}</p>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                        className="w-full px-3 py-1.5 bg-nightBlueShadow text-sandTan rounded-lg 
                        border border-sandTan/20 focus:ring-2 focus:ring-sandTan/30 focus:border-transparent 
                        outline-none text-sm"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Task Creation Form */}
        <div id="createTaskForm" className="bg-nightBlueShadow/50 backdrop-blur-md rounded-xl p-6 border border-sandTan/10">
          <h2 className="text-xl font-semibold text-sandTan mb-4">Create New Task</h2>
          <form onSubmit={createTask} className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-3 bg-nightBlue border border-sandTan/20 rounded-xl 
              text-sandTan placeholder-sandTan/50 focus:ring-2 focus:ring-sandTan/30 
              focus:border-transparent outline-none"
              required
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-3 bg-nightBlue border border-sandTan/20 rounded-xl 
              text-sandTan placeholder-sandTan/50 focus:ring-2 focus:ring-sandTan/30 
              focus:border-transparent outline-none min-h-[100px]"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sandTan to-sandTanShadow 
              text-nightBlueShadow rounded-xl hover:opacity-90 transition-all duration-300 font-medium"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
