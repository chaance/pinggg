import type { User } from "~/models/user";

export interface Post {
  id: string;
  title: string;
  body: string | null;
  createdAt: Date;
}

export interface PostWithAuthor extends Post {
  author: User;
}

export function validatePost(val: any): val is Post {
  return (
    val != null &&
    typeof val === "object" &&
    typeof val.id === "string" &&
    typeof val.title === "string" &&
    (val.body === null || typeof val.body === "string") &&
    val.createdAt instanceof Date
  );
}
