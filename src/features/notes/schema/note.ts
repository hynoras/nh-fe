import { Schema, model, models } from "mongoose"
import { INote } from "../entity/note"

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: false
    },
    tags: [
      {
        type: String
      }
    ],
    // For multi-user support later
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  { timestamps: true } // adds createdAt & updatedAt
)

const Note = models.Note || model<INote>("Note", NoteSchema)
export default Note
