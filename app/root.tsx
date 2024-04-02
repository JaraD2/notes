import {
  Form,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  json,
  LinksFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import appStylesHref from "./app.css?url";
import { getNotes, createEmptyNote } from "./data";
import { useEffect } from "react";
// import { consola } from "consola";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const notes = await getNotes(q);
  return json({ notes, q });
};

export const action = async () => {
  const note = await createEmptyNote();
  return redirect(`/notes/${note.id}/edit`);
};
export const meta = () => [
  {
    title: "Notes",
    description: "A simple notes app",
  },
];

export default function App() {
  const { notes, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Notes</h1>
          <div>
            <Form
              id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search"
            >
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search notes"
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div aria-hidden hidden={!searching} id="search-spinner" />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {notes.length ? (
              <ul>
                {notes
                  .sort((a, b) =>
                    a.viewedAt && b.viewedAt
                      ? a.viewedAt > b.viewedAt
                        ? -1
                        : 1
                      : 0,
                  )
                  .map((note) => (
                    <li key={note.id}>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive ? "active" : isPending ? "pending" : ""
                        }
                        to={`notes/${note.id}`}
                      >
                        <Link to={`notes/${note.id}`}>
                          {note.title ? <>{note.title}</> : <i>No Name</i>}{" "}
                        </Link>
                      </NavLink>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>
                <i>No notes</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={
            navigation.state === "loading" && !searching ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
