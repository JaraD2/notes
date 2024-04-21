import { getAllNotes } from "../db";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import sortBy from "sort-by";

export const loader = async () => {
  const notes = await getAllNotes();
  return json({ notes });
};

export default function Index() {
  const { notes } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Notes</h1>
      <ul id="notePreviewList">
        {notes.sort(sortBy("viewedAt")).map((note) => (
          <li key={note.id}>
            <Link to={`notes/${note.id}`}>
              {note.title ? (
                <h3>
                  {note.title.length > 25
                    ? `${note.title.substring(0, 25)}...`
                    : note.title}
                </h3>
              ) : (
                <i>No Name</i>
              )}{" "}
              {note.content ? (
                <p>
                  {note.content.length > 100
                    ? `${note.content.substring(0, 100)}...`
                    : note.content}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
