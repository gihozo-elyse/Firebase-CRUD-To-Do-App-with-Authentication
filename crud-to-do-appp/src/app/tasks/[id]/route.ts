import { db } from "../../../lib/firebase"
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const body = await req.json()
    const { title, description, completed, priority, userEmail } = body

    const taskRef = doc(db, "tasks", id)
    const taskSnap = await getDoc(taskRef)
    
    if (!taskSnap.exists()) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const taskData = taskSnap.data()
    
    if (userEmail && taskData.userEmail !== userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updateData: {
      title?: string
      description?: string
      completed?: boolean
      priority?: string
    } = {}
    
    if (title !== undefined) {
      updateData.title = title
    }
    if (description !== undefined) {
      updateData.description = description
    }
    if (completed !== undefined) {
      updateData.completed = completed
    }
    if (priority !== undefined) {
      if (priority === "Low" || priority === "Medium" || priority === "High") {
        updateData.priority = priority
      }
    }

    await updateDoc(taskRef, updateData)

    return NextResponse.json({ id: id, ...taskData, ...updateData })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get("userEmail")

    if (userEmail) {
      const taskRef = doc(db, "tasks", id)
      const taskSnap = await getDoc(taskRef)
      
      if (!taskSnap.exists()) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }

      const taskData = taskSnap.data()
      
      if (taskData.userEmail !== userEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const taskRef = doc(db, "tasks", id)
    await deleteDoc(taskRef)

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
