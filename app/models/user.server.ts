import type { User as DBUser, Post as DBPost } from "@prisma/client";
import type { User, UserWithPosts } from "~/models/user";
import { modelPost } from "~/models/post.server";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { waitForQueryLatency } from "~/utils";

export type { User };

const __DEV__ = process.env.NODE_ENV === "development";

export async function getUser(id: DBUser["id"]): Promise<User | null>;
export async function getUser(
  id: DBUser["id"],
  opts?: { includePosts?: false }
): Promise<User | null>;
export async function getUser(
  id: DBUser["id"],
  opts?: { includePosts: true }
): Promise<UserWithPosts | null>;
export async function getUser(
  id: DBUser["id"],
  opts?: { includePosts?: boolean }
): Promise<User | UserWithPosts | null> {
  if (__DEV__) await waitForQueryLatency();
  let user = await prisma.user.findUnique({
    where: { id },
    include: opts?.includePosts ? { posts: true } : undefined,
  });
  return user ? modelUser(user) : null;
}

export async function getUserByEmail(email: string): Promise<User | null>;
export async function getUserByEmail(
  email: string,
  opts?: { includePosts?: false }
): Promise<User | null>;
export async function getUserByEmail(
  email: string,
  opts?: { includePosts: true }
): Promise<UserWithPosts | null>;
export async function getUserByEmail(
  email: string,
  opts?: { includePosts?: boolean }
): Promise<User | UserWithPosts | null> {
  if (__DEV__) await waitForQueryLatency();
  let user = await prisma.user.findUnique({
    where: { email },
    include: opts?.includePosts ? { posts: true } : undefined,
  });
  return user ? modelUser(user) : null;
}

export async function createUser({
  email,
  name,
  password,
}: CreateUserData): Promise<User>;
export async function createUser(
  { email, name, password }: CreateUserData,
  opts?: { includePosts?: false }
): Promise<User>;
export async function createUser(
  { email, name, password }: CreateUserData,
  opts?: { includePosts: true }
): Promise<UserWithPosts>;

export async function createUser(
  { email, name, password }: CreateUserData,
  opts?: { includePosts?: boolean }
): Promise<User | UserWithPosts> {
  let hashedPassword = await bcrypt.hash(password || "pinggg", 10);
  if (__DEV__) await waitForQueryLatency();
  return prisma.user.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
    include: opts?.includePosts ? { posts: true } : undefined,
  });
}

export async function deleteUser(id: User["id"]): Promise<User>;
export async function deleteUser(
  id: User["id"],
  opts?: { includePosts?: false }
): Promise<User>;
export async function deleteUser(
  id: User["id"],
  opts?: { includePosts: true }
): Promise<UserWithPosts>;

export async function deleteUser(
  id: User["id"],
  opts?: { includePosts?: boolean }
): Promise<User | UserWithPosts> {
  if (__DEV__) await waitForQueryLatency();
  return prisma.user.delete({
    where: { id },
    include: opts?.includePosts ? { posts: true } : undefined,
  });
}

export function modelUser(userData: DBUser, posts: DBPost[]): UserWithPosts;
export function modelUser(userData: DBUser): User;
export function modelUser(
  userData: DBUser,
  posts?: DBPost[]
): User | UserWithPosts {
  let user: User | UserWithPosts = {
    id: userData.id,
    email: userData.email,
    name: userData.name,
  };
  if (posts) {
    (user as UserWithPosts).posts = posts.map((post) => modelPost(post));
  }
  return user;
}

interface CreateUserData {
  email: string;
  name: string;
  password?: string;
}
