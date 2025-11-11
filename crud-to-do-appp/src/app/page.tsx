'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, onAuthStateChanged, User } from 'firebase/auth'
import { collection, query, where, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from './lib/firebase'
import ProtectedRoute from './components/ProtectedRoute'
import { Task } from './types/task'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user || !user.email) {
      return
    }

    const q = query(collection(db, 'tasks'), where('userEmail', '==', user.email))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList: Task[] = []
      snapshot.forEach((doc) => {
        tasksList.push({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          completed: doc.data().completed,
          priority: doc.data().priority,
          userEmail: doc.data().userEmail
        })
      })
      setTasks(tasksList)
    })

    return () => unsubscribe()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !user.email) {
      return
    }

    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      if (editingTask) {
        const taskRef = doc(db, 'tasks', editingTask.id)
        await updateDoc(taskRef, {
          title: title,
          description: description,
          priority: priority
        })
        setEditingTask(null)
      } else {
        await addDoc(collection(db, 'tasks'), {
          title: title,
          description: description,
          priority: priority,
          completed: false,
          userEmail: user.email
        })
      }
      setTitle('')
      setDescription('')
      setPriority('Medium')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save task')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setTitle('')
    setDescription('')
    setPriority('Medium')
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'tasks', taskId))
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete task')
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const taskRef = doc(db, 'tasks', task.id)
      await updateDoc(taskRef, {
        completed: !task.completed
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update task')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to log out')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-yellow-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-900">
              Hello, {user?.email}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-black text-yellow-400 px-4 py-2 rounded hover:bg-gray-800 transition font-medium"
            >
              Logout
            </button>
          </div>

          <div className="bg-yellow-100 border-2 border-black p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-yellow-900">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-900 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-2 border-black rounded px-3 py-2 bg-white text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-900 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-black rounded px-3 py-2 bg-white text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-900 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                  className="w-full border-2 border-black rounded px-3 py-2 bg-white text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-black text-yellow-400 px-4 py-2 rounded hover:bg-gray-800 transition font-medium"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                {editingTask && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-black text-yellow-400 px-4 py-2 rounded hover:bg-gray-800 transition font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-yellow-100 border-2 border-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-900">Your Tasks</h2>
            {tasks.length === 0 ? (
              <p className="text-yellow-900 text-center py-8">No tasks yet. Create your first task above!</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border-2 border-black rounded-lg p-4 ${
                      task.completed ? 'bg-yellow-200 opacity-75' : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task)}
                          className="mt-1 w-5 h-5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-lg ${
                              task.completed ? 'line-through text-yellow-700' : 'text-yellow-900'
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p
                              className={`mt-1 ${
                                task.completed ? 'line-through text-yellow-700' : 'text-yellow-900'
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border border-black ${
                                task.priority === 'High'
                                  ? 'bg-black text-yellow-400'
                                  : task.priority === 'Medium'
                                  ? 'bg-yellow-600 text-black'
                                  : 'bg-yellow-400 text-black'
                              }`}
                            >
                              {task.priority}
                            </span>
                            {task.completed && (
                              <span className="text-xs text-yellow-700">Completed</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(task)}
                          className="bg-black text-yellow-400 px-3 py-1 rounded text-sm hover:bg-gray-800 transition font-medium"
                          disabled={task.completed}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="bg-black text-yellow-400 px-3 py-1 rounded text-sm hover:bg-gray-800 transition font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
