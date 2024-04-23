import { PrismaClient } from "@prisma/client";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

const db = new PrismaClient();

type NoteMutation = {
  id?: number;
  title?: string;
  content?: string;
  userId?: number;
  createdAt?: string;
  viewedAt?: string;
};

export type NoteRecord = NoteMutation & {
  id: number;
  createdAt: string;
};

export const getAllNotes = async (query?: string | null) => {
  let notes = await db.notes.findMany();
  if (query) {
    notes = matchSorter(notes, query, {
      keys: ["title", "note"], // searches the title and note fields
    });
  }

  return notes.sort(sortBy("viewedAt"));
};

export const getNote = async (id: number) => {
  return await db.notes.findUnique({ where: { id } });
};
export const updateNote = async (id: number, updates: NoteMutation) => {

  return await db.notes.update({
    where: { id },
    data: updates,
  });
};
export const deleteNote = async (id: number) => {
  return await db.notes.delete({ where: { id } });
}

export const createEmptyNote = async () => {
  return await db.notes.create({
    data: {
      title: "",
      userId: 1,
      content: "",
      createdAt: new Date().toISOString(),
      viewedAt: new Date().toISOString(),
    },
  });
};

