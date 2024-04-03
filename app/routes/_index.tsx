import { getNotes } from "../data";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

export const loader = async () => {
  const notes = await getNotes();
  return json({ notes });
};

export default function Index() {
  const { notes } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Notes</h1>
      <ul id="notePreviewList">
        {notes
          .sort((a, b) =>
            a.viewedAt && b.viewedAt ? (a.viewedAt > b.viewedAt ? -1 : 1) : 0,
          )
          .map((note) => (
            <li key={note.id}>
              <Link to={`notes/${note.id}`}>
                {note.title ? (
                  <h3>
                    {note.title.length > 100
                      ? `${note.title.substring(0, 100)}...`
                      : note.title}
                  </h3>
                ) : (
                  <i>No Name</i>
                )}{" "}
                {note.note ? (
                  <p>
                    {note.note.length > 100
                      ? `${note.note.substring(0, 100)}...`
                      : note.note}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
