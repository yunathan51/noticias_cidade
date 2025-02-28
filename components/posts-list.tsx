"use client"

import { useEffect, useState, useCallback } from "react"
import { getPosts } from "@/lib/actions"
import PostCard from "@/components/post-card"
import type { Post } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PostsList({ initialSortBy }: { initialSortBy: "date" | "votes" }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [sortBy, setSortBy] = useState<"date" | "votes">(initialSortBy)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const loadPosts = useCallback(
    async (reset = false) => {
      setIsLoading(true)
      const newPage = reset ? 1 : page
      const result = await getPosts(sortBy, newPage)
      setPosts((prev) => (reset ? result.posts : [...prev, ...result.posts]))
      setHasMore(result.hasMore)
      setPage((prev) => (reset ? 1 : prev + 1))
      setIsLoading(false)
    },
    [page, sortBy],
  )

  useEffect(() => {
    loadPosts(true)
  }, [loadPosts])

  const handleSortChange = (newSortBy: "date" | "votes") => {
    if (newSortBy !== sortBy) {
      setSortBy(newSortBy)
    }
  }

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
        <h3 className="text-xl font-medium">Nenhuma postagem ainda</h3>
        <p className="text-muted-foreground mt-2">Seja o primeiro a compartilhar uma notícia!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2 mb-4">
        <Button variant={sortBy === "date" ? "default" : "outline"} onClick={() => handleSortChange("date")}>
          Mais Recentes
        </Button>
        <Button variant={sortBy === "votes" ? "default" : "outline"} onClick={() => handleSortChange("votes")}>
          Mais Votados
        </Button>
      </div>

      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => loadPosts()} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              "Carregar mais"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

