import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getNote, updateNote } from "../data";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.notesId, "Missing notesId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateNote(params.notesId, updates);
  return redirect(`/notes/${params.notesId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.notesId, "Missing contactId param");
  const notes = await getNote(params.notesId);
  if (!notes) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ notes });
};

export default function EditNotes() {
  const { notes } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={notes.id} id="note-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={notes.title}
          aria-label="title"
          name="title"
          type="text"
          placeholder="First"
        />
      </p>
      <label>
        <span>Notes</span>
        <textarea defaultValue={notes.note} name="note" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
