"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge" // Import Badge
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
    badgeText?: string // Added badgeText property
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // If item has badgeText, render as inactive with badge
          if (item.badgeText) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="opacity-60 cursor-default hover:bg-transparent focus:ring-0 justify-start"
                  disabled // Make the button non-interactive
                >
                  {item.icon && <item.icon />}
                  <span className="flex-grow">{item.title}</span>
                  <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5 font-normal">
                    {item.badgeText}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // If item has no subitems (and no badgeText), render as a simple link
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // If item has subitems, render as collapsible
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
