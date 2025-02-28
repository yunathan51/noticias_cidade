export interface Post {
  id: string
  content: string
  imageUrl: string | null
  votes: number
  createdAt: string
}

export interface CreatePostData {
  content: string
  imageUrl: string | null
}

export interface PaginatedPosts {
  posts: Post[]
  hasMore: boolean
}

export interface UserVotes {
  [postId: string]: "up" | "down" | null
}

