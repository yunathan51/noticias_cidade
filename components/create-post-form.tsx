"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Loader2 } from "lucide-react"
import { createPost } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"

export default function CreatePostForm() {
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo da postagem não pode estar vazio",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createPost({
        content,
        imageUrl,
      })

      setContent("")
      setImageUrl(null)

      toast({
        title: "Sucesso!",
        description: "Sua postagem foi publicada",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível publicar sua postagem",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="O que está acontecendo na cidade?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="resize-none"
      />

      {imageUrl && (
        <div className="relative w-full h-48 mt-2">
          <Image src={imageUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover rounded-md" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setImageUrl(null)}
          >
            Remover
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <CldUploadButton
          uploadPreset="noticias_cidade"
          onUpload={(result: any) => {
            setImageUrl(result.info.secure_url)
          }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ImagePlus size={20} />
            <span>Anexar uma foto</span>
          </div>
        </CldUploadButton>

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">Seu post será anônimo</p>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

