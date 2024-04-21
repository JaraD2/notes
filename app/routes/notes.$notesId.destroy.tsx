import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteNote } from "../db";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.notesId, "Missing contactId param");
  await deleteNote(Number(params.notesId));
  return redirect("/");
};
