import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getNote, updateNote } from "../data";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.notesId, "Missing notesId param");
  const notes = await getNote(params.notesId);
  const viewedAt = { viewedAt: new Date().toISOString() };
  await updateNote(params.notesId, viewedAt);
  if (!notes) {
    throw new Response("Not Found", { status: 404 });
  } else {
    console.log("note", notes);
  }
  return json({ notes });
};

export default function Note() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <h1>{notes.title ? <>{notes.title}</> : <i>No Name</i>} </h1>
        {notes.viewedAt ? <sub>{notes.viewedAt}</sub> : null}
        {notes.note ? <p>{notes.note}</p> : null}

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
