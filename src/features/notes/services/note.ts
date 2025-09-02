import { INote } from "../entity/note"
import Note from "../schema/note"

export class NoteService {
  public createNote = async (noteData: Omit<INote, "createdAt" | "updatedAt">) => {
    const note = new Note(noteData)
    return await note.save()
  }
}
