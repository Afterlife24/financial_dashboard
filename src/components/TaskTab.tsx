import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, X } from 'lucide-react';

interface Task {
  _id?: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TaskTabProps {
  person: string;
}

const TaskTab: React.FC<TaskTabProps> = ({ person }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/tasks/${person}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, [person]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      text: newTask.trim(),
      completed: false,
      createdAt: new Date(),
      person
    };
    fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
      .then(res => res.json())
      .then(data => {
        setTasks([data, ...tasks]);
        setNewTask('');
      });
  };

  const toggleTask = (id: string, completed: boolean) => {
    fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => (t._id === id ? updated : t)));
      });
  };

  const deleteTask = (id: string) => {
    fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter(t => t._id !== id)));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const getPersonColor = (name: string) =>
    ({ Austin: 'blue', Dhanush: 'emerald', Ashrith: 'purple' }[name] || 'blue');

  const getInitials = (name: string) => name.charAt(0).toUpperCase();
  const color = getPersonColor(person);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full bg-${color}-500 flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
            {getInitials(person)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{person}'s Tasks</h2>
            <p className="text-gray-600">{completedTasks} of {totalTasks} tasks completed</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
          />
          <button
            onClick={addTask}
            className={`px-6 py-3 bg-${color}-500 text-white rounded-lg hover:bg-${color}-600`}
          >
            <Plus className="w-4 h-4 inline-block mr-1" />
            Add Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No tasks yet</div>
        ) : (
          tasks.map(task => (
            <div
              key={task._id}
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                task.completed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <button onClick={() => toggleTask(task._id!, task.completed)}>
                  {task.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-gray-400" />}
                </button>
                <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'} flex-1`}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                <button onClick={() => deleteTask(task._id!)} className="text-red-500 hover:scale-110 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskTab;
