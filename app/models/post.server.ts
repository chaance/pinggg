import type { User as DBUser, Post as DBPost } from "@prisma/client";
import type { Post, PostWithAuthor } from "~/models/post";
import { prisma } from "~/db.server";
import { waitForQueryLatency } from "~/utils";
import { modelUser } from "./user.server";

export type { Post };

const __DEV__ = process.env.NODE_ENV === "development";

export async function getPost(id: DBPost["id"]): Promise<Post | null>;
export async function getPost(
  id: DBPost["id"],
  opts?: { includeAuthor?: false }
): Promise<Post | null>;
export async function getPost(
  id: DBPost["id"],
  opts?: { includeAuthor: true }
): Promise<PostWithAuthor | null>;

export async function getPost(
  id: DBPost["id"],
  opts?: { includeAuthor?: boolean }
): Promise<Post | PostWithAuthor | null> {
  if (__DEV__) await waitForQueryLatency();
  let post = await prisma.post.findUnique({
    where: { id },
    include: opts?.includeAuthor ? { Author: true } : undefined,
  });
  return post ? modelPost(post) : null;
}

export async function createPost({
  title,
  body,
}: CreatePostData): Promise<Post>;
export async function createPost(
  { title, body }: CreatePostData,
  opts?: { includeAuthor: false }
): Promise<Post | PostWithAuthor>;
export async function createPost(
  { title, body }: CreatePostData,
  opts: { includeAuthor: true }
): Promise<Post | PostWithAuthor>;

export async function createPost(
  { title, body }: CreatePostData,
  opts?: { includeAuthor?: boolean }
): Promise<Post | PostWithAuthor> {
  if (__DEV__) await waitForQueryLatency();
  return prisma.post.create({
    data: {
      title,
      body,
    },
    include: opts?.includeAuthor ? { Author: true } : undefined,
  });
}

export async function deletePost(id: Post["id"]): Promise<Post>;
export async function deletePost(
  id: Post["id"],
  opts?: { includeAuthor?: false }
): Promise<Post>;
export async function deletePost(
  id: Post["id"],
  opts?: { includeAuthor: true }
): Promise<PostWithAuthor>;

export async function deletePost(
  id: Post["id"],
  opts?: { includeAuthor?: boolean }
): Promise<Post | PostWithAuthor> {
  if (__DEV__) await waitForQueryLatency();
  return prisma.post.delete({
    where: { id },
    include: opts?.includeAuthor ? { Author: true } : undefined,
  });
}

interface CreatePostData {
  title: string;
  body: string | null;
}

export function modelPost(post: DBPost): Post;
export function modelPost(post: DBPost, author: DBUser): PostWithAuthor;
export function modelPost(
  postData: DBPost,
  author?: DBUser
): Post | PostWithAuthor {
  let post: Post | PostWithAuthor = {
    id: postData.id,
    title: postData.title,
    body: postData.body,
    createdAt: new Date(postData.createdAt),
  };
  if (author) {
    (post as PostWithAuthor).author = modelUser(author);
  }
  return post;
}
