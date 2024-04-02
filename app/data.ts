////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type NoteMutation = {
  id?: string;
  title?: string;
  note?: string;
  viewedAt?: string;
};

export type NoteRecord = NoteMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeNotes = {
  notes: {} as Record<string, NoteRecord>,

  async getAll(): Promise<NoteRecord[]> {
    return Object.keys(fakeNotes.notes)
      .map((key) => fakeNotes.notes[key])
      .sort(sortBy("viewedAt"));
  },

  async get(id: string): Promise<NoteRecord | null> {
    return fakeNotes.notes[id] || null;
  },

  async create(values: NoteMutation): Promise<NoteRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const viewedAt = new Date().toISOString();
    const newNote = { id, createdAt, viewedAt, ...values };
    fakeNotes.notes[id] = newNote;
    return newNote;
  },

  async set(id: string, values: NoteMutation): Promise<NoteRecord> {
    const note = await fakeNotes.get(id);
    invariant(note, `No notes found for ${id}`);
    const updatedNote = { ...note, ...values };
    fakeNotes.notes[id] = updatedNote;
    return updatedNote;
  },

  destroy(id: string): null {
    delete fakeNotes.notes[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getNotes(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let Notes = await fakeNotes.getAll();
  if (query) {
    Notes = matchSorter(Notes, query, {
      keys: ["title", "note"], // searches the title and note fields
    });
  }
  return Notes.sort(sortBy("viewedAt"));
}

export async function createEmptyNote() {
  const Note = await fakeNotes.create({});
  return Note;
}

export async function getNote(id: string) {
  return fakeNotes.get(id);
}

export async function updateNote(id: string, updates: NoteMutation) {
  const note = await fakeNotes.get(id);
  if (!note) {
    throw new Error(`No notes found for ${id}`);
  }
  await fakeNotes.set(id, { ...note, ...updates });
  return note;
}

export async function deleteNote(id: string) {
  fakeNotes.destroy(id);
}

[
  {
    id: 1,
    title: "First Note",
    note: "This is the first note",
    viewedAt: "2024-04-02T16:35:11.496Z",
  },
  {
    id: 2,
    title: "Second Note",
    note: "this is the second note",
    viewedAt: "2024-04-02T16:35:11.496Z",
  },
].forEach((note) => {
  fakeNotes.create({
    ...note,
    id: `${note.id}`,
  });
});
