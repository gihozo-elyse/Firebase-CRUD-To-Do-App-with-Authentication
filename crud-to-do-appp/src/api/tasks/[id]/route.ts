import { db } from "../../../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: { params: any }) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const taskRef = doc(db, "task", id);
    await updateDoc(taskRef, {
      ...body,
      updatedAt: new Date(),
    });

    return NextResponse.json({ id, ...body });
  } catch (err) {
    console.error("PUT /api/tasks/:id error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}



//delete

export async function DELETE(req: Request, context: { params: any }) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const taskRef = doc(db, "task", id);    // uded doc bcz we added id
    await deleteDoc(taskRef);

    return NextResponse.json({ message: "Task deleted " });
  } catch (error) {
    console.error("DELETE /api/tasks/:id error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}