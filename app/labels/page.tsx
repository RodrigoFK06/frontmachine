"use client"

import { useState, useEffect } from "react"
import { useLabels } from "@/hooks/use-labels"
import { LabelCard } from "@/components/label-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"
import type { Label } from "@/store/use-store"

export default function LabelsPage() {
  const { labels, isLoading } = useLabels()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLabels, setFilteredLabels] = useState<Label[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Asegurarnos de que labels sea un array
  const safeLabels = Array.isArray(labels) ? labels : []

  // Find unique categories
  const categories = ["all", ...Array.from(new Set(safeLabels.map((label) => label.category)))]

  // Filter labels based on search and category
  useEffect(() => {
    // Asegurarnos de que labels sea un array
    const safeLabels = Array.isArray(labels) ? labels : []
    let filtered = [...safeLabels]

    if (searchTerm) {
      filtered = filtered.filter(
        (label) =>
          label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          label.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((label) => label.category === activeCategory)
    }

    setFilteredLabels(filtered)
  }, [labels, searchTerm, activeCategory])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo de señas médicas</h1>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar señas..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-6 flex flex-wrap h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="mb-1">
              {category === "all" ? "Todas" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-[250px]" />
              ))}
            </div>
          ) : filteredLabels.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">No se encontraron señas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabels.map((label) => (
                <LabelCard key={label.id} label={label} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
