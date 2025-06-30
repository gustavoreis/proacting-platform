"use client"

import * as React from "react"
import { type LucideIcon, User, Settings, ChevronRight, X, Save, Loader2 } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePractitioner } from "@/hooks/use-practitioner"

// Define the structure for settings sections
interface SettingsSection {
  id: string
  label: string
  icon: LucideIcon
  content: React.ReactNode
}

// Component for Practitioner Profile Settings
function PractitionerProfileSettings() {
  const { practitioner, updating, updatePractitionerData } = usePractitioner()
  const [formData, setFormData] = React.useState({
    name: "",
    bio: "",
  })

  React.useEffect(() => {
    if (practitioner) {
      setFormData({
        name: practitioner.name || "",
        bio: practitioner.bio || "",
      })
    }
  }, [practitioner])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await updatePractitionerData({
        name: formData.name,
        bio: formData.bio,
      })

      if (result.success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso.",
        })
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao salvar alterações",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar alterações",
        variant: "destructive",
      })
    }
  }

  if (!practitioner) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite seu nome completo"
            required
          />
        </div>
        <div>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Descreva sua experiência e especialidades"
            rows={4}
          />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={updating}>
        {updating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </>
        )}
      </Button>
    </form>
  )
}

// Component for General Settings
function GeneralSettings() {
  const { practitioner, updating, updatePractitionerData } = usePractitioner()
  const [formData, setFormData] = React.useState({
    prefix: "",
    email: "",
  })

  React.useEffect(() => {
    if (practitioner) {
      setFormData({
        prefix: practitioner.prefix || "",
        email: practitioner.email || "",
      })
    }
  }, [practitioner])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await updatePractitionerData({
        prefix: formData.prefix || null,
        email: formData.email,
      })

      if (result.success) {
        toast({
          title: "Configurações atualizadas",
          description: "Suas configurações foram salvas com sucesso.",
        })
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao salvar alterações",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar alterações",
        variant: "destructive",
      })
    }
  }

  if (!practitioner) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="prefix">Prefixo (Dr., Dra., etc.)</Label>
          <Input
            id="prefix"
            value={formData.prefix}
            onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
            placeholder="Ex: Dr., Dra."
            maxLength={20}
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="seu@email.com"
            required
          />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={updating}>
        {updating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </>
        )}
      </Button>
    </form>
  )
}

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string // Can be a regular URL or a special identifier like 'settings-modal'
    icon: LucideIcon
    target?: string // For opening in new tab
  }[]
}) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false)
  const [activeSettingsSection, setActiveSettingsSection] = React.useState<string>("profile")

  const settingsItems: SettingsSection[] = [
    {
      id: "profile",
      label: "Perfil Profissional",
      icon: User,
      content: <PractitionerProfileSettings />,
    },
    {
      id: "settings",
      label: "Configurações Gerais",
      icon: Settings,
      content: <GeneralSettings />,
    },
  ]

  const handleItemClick = (url: string) => {
    if (url === "settings-modal") {
      setActiveSettingsSection("profile") // Reset to default section
      setIsSettingsModalOpen(true)
    } else {
      // For regular URLs, let the <a> tag handle it
    }
  }

  const activeSection = settingsItems.find((item) => item.id === activeSettingsSection) || settingsItems[0]

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Suporte</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.name}>
              {item.url === "settings-modal" ? (
                // Render as SidebarMenuButton for modal trigger
                <SidebarMenuButton
                  onClick={() => handleItemClick(item.url)}
                  className="cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              ) : (
                // Render as SidebarMenuButton with asChild for external links
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    target={item.target}
                    rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="max-w-4xl h-[70vh] p-0 flex gap-0">
          {/* Left Sidebar in Modal */}
          <div className="w-1/3 min-w-[280px] bg-muted border-r p-4 flex flex-col">
            <h2 className="text-lg font-semibold px-2 pb-2 mb-2 border-b">Configurações</h2>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {settingsItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSettingsSection === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveSettingsSection(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Right Content Area in Modal */}
          <div className="w-2/3 flex flex-col overflow-hidden">
            <DialogHeader className="p-4 border-b bg-background">
              <DialogTitle className="sr-only">
                Configurações - {activeSection.label}
              </DialogTitle>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>Settings</span>
                  <ChevronRight className="h-3 w-3 inline mx-1 text-muted-foreground/70" />
                  <span className="text-foreground font-medium">{activeSection.label}</span>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 bg-background">{activeSection.content}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
