import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddWidgetForm } from "./AddWidgetForm"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface CreateWidgetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateWidgetModal({ isOpen, onClose }: CreateWidgetModalProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  async function loadData() {
    setIsLoading(true)
    try {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("tags").select("*")
      ])

      if (categoriesResponse.error) throw categoriesResponse.error
      if (tagsResponse.error) throw tagsResponse.error

      setCategories(categoriesResponse.data)
      setTags(tagsResponse.data)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Widget</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <AddWidgetForm 
            categories={categories}
            tags={tags}
            onSuccess={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
} 