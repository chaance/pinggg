import { forwardRef, useMemo } from "react";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import type { FormProps } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getUser } from "~/models/user.server";

export async function loader({ params }: LoaderArgs) {
  let userId = params.userId;
  invariant(userId, "userId is required");
  try {
    let user = await getUser(userId);
    if (user) {
      return json(user);
    }
    throw json("User does not exist", 404);
  } catch (err) {
    throw json("There was an error looking for the user", 500);
  }
}

export function useUserFetcher(userId: string) {

}
