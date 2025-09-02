import { INote } from "features/notes/entity/note"
import { NoteService } from "features/notes/services/note"
import { connectToDatabase } from "lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
import { createResponse } from "utils/response"

export async function POST(req: Request, res: Response) {
  type Body = Omit<INote, "createdAt" | "updatedAt">
  try {
    await connectToDatabase()
    const noteService = new NoteService()
    const body: Body = await req.json()
    await noteService.createNote(body)
    return NextResponse.json(createResponse("Note created successfully", res, true))
  } catch (error) {
    return NextResponse.json(createResponse(`Error creating note: ${error}`, null, false))
  }
}
