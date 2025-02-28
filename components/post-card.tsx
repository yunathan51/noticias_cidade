"use client"

import { useState, useEffect } from "react"
import { ArrowBigDown, ArrowBigUp, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import type { Post } from "@/lib/types"
import { votePost, getUserVotes } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function PostCard({ post }: { post: Post }) {
  const [optimisticVotes, setOptimisticVotes] = useState(post.votes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getUserVotes().then((votes) => {
      setUserVote(votes[post.id] || null)
    })
  }, [post.id])

  const handleVote = async (voteType: "up" | "down") => {
    if (isVoting) return

    setIsVoting(true)

    // If user is clicking the same vote button again, remove their vote
    if (userVote === voteType) {
      setUserVote(null)
      setOptimisticVotes(optimisticVotes - (voteType === "up" ? 1 : -1))
    }
    // If user is changing their vote
    else if (userVote) {
      setUserVote(voteType)
      setOptimisticVotes(optimisticVotes + (voteType === "up" ? 2 : -2))
    }
    // If user is voting for the first time
    else {
      setUserVote(voteType)
      setOptimisticVotes(optimisticVotes + (voteType === "up" ? 1 : -1))
    }

    try {
      const updatedPost = await votePost(post.id, voteType)
      setOptimisticVotes(updatedPost.votes)
      setUserVote(voteType)
      router.refresh()
    } catch (error) {
      // Revert optimistic update on error
      setUserVote(userVote)
      setOptimisticVotes(post.votes)
      console.error("Error voting:", error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span>
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>

        <p className="mb-4">{post.content}</p>

        {post.imageUrl && (
          <div className="relative w-full h-64 mb-4">
            <Image src={post.imageUrl || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-2 flex items-center border-t">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote("up")}
            className={cn("p-1 rounded hover:bg-gray-200", userVote === "up" && "text-green-500")}
            disabled={isVoting}
          >
            <ArrowBigUp className="h-6 w-6" />
          </button>

          <span
            className={cn(
              "font-medium text-lg mx-1",
              optimisticVotes > 0 && "text-green-500",
              optimisticVotes < 0 && "text-red-500",
            )}
          >
            {optimisticVotes}
          </span>

          <button
            onClick={() => handleVote("down")}
            className={cn("p-1 rounded hover:bg-gray-200", userVote === "down" && "text-red-500")}
            disabled={isVoting}
          >
            <ArrowBigDown className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

