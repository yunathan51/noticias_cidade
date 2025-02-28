import { Suspense } from "react"
import PostsList from "@/components/posts-list"
import CreatePostForm from "@/components/create-post-form"
import { PostsSkeleton } from "@/components/posts-skeleton"
import { AboutSection } from "@/components/about-section"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Últimas Notícias</h2>

          <Suspense fallback={<PostsSkeleton />}>
            <PostsList initialSortBy="date" />
          </Suspense>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Compartilhe uma notícia</h2>
            <CreatePostForm />
          </div>

          <AboutSection />
        </div>
      </div>
    </main>
  )
}

