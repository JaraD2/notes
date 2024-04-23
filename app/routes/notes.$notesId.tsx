import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getNote, updateNote } from "../db";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.notesId, "Missing notesId param");
  const notes = await getNote(Number(params.notesId));
  const viewedAt = { viewedAt: new Date().toISOString() };
  await updateNote(Number(params.notesId), viewedAt);
  if (!notes) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ notes });
};

export default function Note() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <div id="note">
      <div>
        <h1>{notes.title ? <>{notes.title}</> : <i>No Name</i>} </h1>
        {notes.viewedAt ? <sub>{notes.viewedAt}</sub> : null}
        {notes.content ? <pre>{notes.content}</pre> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record.",
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
