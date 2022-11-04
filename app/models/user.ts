import type { Post } from "~/models/post";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserWithPosts extends User {
  posts: Post[];
}

export function validateUser(val: any): val is User {
  return (
    val != null &&
    typeof val === "object" &&
    typeof val.id === "string" &&
    typeof val.name === "string" &&
    typeof val.email === "string"
  );
}

export function validateUserWithPosts(val: any): val is UserWithPosts {
  return (
    validateUser(val) &&
    // @ts-expect-error
    Array.isArray(val.posts) &&
    // @ts-expect-error
    val.posts.every(validatePost)
  );
}
