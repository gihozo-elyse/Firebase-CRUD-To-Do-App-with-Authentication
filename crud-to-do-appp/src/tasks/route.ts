import { NextResponse } from "next/server"
import { db } from "../../lib/firebase"
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get("userEmail")
    
    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const q = query(collection(db, "tasks"), where("userEmail", "==", userEmail))
    const snapshot = await getDocs(q)
    const tasks: {
      id: string
      title: string
      description: string
      completed: boolean
      priority: string
      userEmail: string
    }[] = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      tasks.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        priority: data.priority,
        userEmail: data.userEmail
      })
    })
    
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, priority, userEmail } = body

    if (!title || !userEmail) {
      return NextResponse.json({ error: "Title and userEmail are required" }, { status: 400 })
    }

    let taskPriority = "Medium"
    if (priority === "Low" || priority === "Medium" || priority === "High") {
      taskPriority = priority
    }

    const newTaskRef = await addDoc(collection(db, "tasks"), {
      title: title,
      description: description || "",
      completed: false,
      priority: taskPriority,
      userEmail: userEmail
    })

    return NextResponse.json({
      id: newTaskRef.id,
      title: title,
      description: description || "",
      completed: false,
      priority: taskPriority,
      userEmail: userEmail
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
