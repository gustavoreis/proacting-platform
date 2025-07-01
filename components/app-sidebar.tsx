"use client"

import type * as React from "react"
import { Map, Settings, SquareStack, Users, MessageCircle, BookOpen } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Atendimentos",
      url: "/orders",
      icon: SquareStack,
      isActive: false,
      items: [
        {
          title: "Novos",
          url: "/orders?status=pending",
        },
        {
          title: "Em atendimento",
          url: "/orders?status=in-progress",
        },
        {
          title: "Finalizados",
          url: "/orders?status=completed",
        },
      ],
    },
    {
      title: "Protocolos",
      url: "/protocolos",
      icon: Map,
      isActive: false,
    },
    {
      title: "Audiência",
      url: "#",
      icon: Users,
      isActive: false,
      badgeText: "Em breve",
    },
  ],
  supportItems: [
    {
      name: "Ajuda",
      url: "https://wa.me/5551993252084",
      icon: MessageCircle,
      target: "_blank",
    },
    {
      name: "Documentação",
      url: "https://ajuda.proact.ing",
      icon: BookOpen,
      target: "_blank",
    },
    {
      name: "Configurações",
      url: "settings-modal",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Dados padrão caso o usuário não esteja carregado ainda
  const userData = {
    name: user?.name || "Usuário",
    email: user?.email || "email@example.com",
    avatar: user?.avatar || "/placeholder-user.jpg",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.supportItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
