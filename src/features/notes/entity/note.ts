import dayjs from "dayjs"
import { Document, Types } from "mongoose"

export interface INote extends Document {
  title: string
  content?: string
  tags?: string[]
  userId?: Types.ObjectId
  createdAt?: dayjs.Dayjs
  updatedAt?: dayjs.Dayjs
}
