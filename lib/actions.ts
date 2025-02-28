"use server"

import type { CreatePostData, Post, PaginatedPosts, UserVotes } from "./types"
import { v4 as uuidv4 } from "uuid"
import { cookies } from "next/headers"
import { prisma } from "./db"

export async function getPosts(sortBy: "date" | "votes" = "date", page = 1, perPage = 20): Promise<PaginatedPosts> {
  const skip = (page - 1) * perPage

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      take: perPage,
      skip: skip,
      orderBy: sortBy === "date" ? { createdAt: "desc" } : { votes: "desc" },
    }),
    prisma.post.count(),
  ])

  return {
    posts,
    hasMore: skip + perPage < totalPosts,
  }
}

export async function createPost(data: CreatePostData): Promise<Post> {
  const newPost = await prisma.post.create({
    data: {
      content: data.content,
      imageUrl: data.imageUrl,
    },
  })

  return newPost
}

export async function votePost(postId: string, voteType: "up" | "down"): Promise<Post> {
  const userId = await getUserId()

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: userId,
        postId: postId,
      },
    },
  })

  if (existingVote) {
    if (existingVote.type === voteType) {
      // Remove o voto se o usuário está votando da mesma forma novamente
      await prisma.vote.delete({
        where: { id: existingVote.id },
      })
      return updatePostVotes(postId, voteType === "up" ? -1 : 1)
    } else {
      // Muda o voto se o usuário está votando de forma diferente
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type: voteType },
      })
      return updatePostVotes(postId, voteType === "up" ? 2 : -2)
    }
  } else {
    // Cria um novo voto
    await prisma.vote.create({
      data: {
        type: voteType,
        userId: userId,
        postId: postId,
      },
    })
    return updatePostVotes(postId, voteType === "up" ? 1 : -1)
  }
}

async function updatePostVotes(postId: string, change: number): Promise<Post> {
  return prisma.post.update({
    where: { id: postId },
    data: { votes: { increment: change } },
  })
}

export async function getUserVotes(): Promise<UserVotes> {
  const userId = await getUserId()
  const votes = await prisma.vote.findMany({
    where: { userId: userId },
    select: { postId: true, type: true },
  })

  return votes.reduce((acc, vote) => {
    acc[vote.postId] = vote.type as "up" | "down"
    return acc
  }, {} as UserVotes)
}

async function getUserId(): Promise<string> {
  const cookieStore = cookies()
  let userId = cookieStore.get("userId")?.value

  if (!userId) {
    userId = uuidv4()
    cookieStore.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
  }

  return userId
}

export async function setCookie(name: string, value: string) {
  cookies().set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
}

