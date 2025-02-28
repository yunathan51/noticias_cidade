"use client"

import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { setCookie } from "@/lib/actions"

export function SortingSelector() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<string>("date")

  useEffect(() => {
    // Get initial value from cookie
    const cookieValue =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("sortBy="))
        ?.split("=")[1] || "date"

    setSortBy(cookieValue)
  }, [])

  const handleSortChange = async (value: string) => {
    setSortBy(value)
    await setCookie("sortBy", value)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Ordenar por:</span>
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Mais recentes</SelectItem>
          <SelectItem value="votes">Mais votados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

