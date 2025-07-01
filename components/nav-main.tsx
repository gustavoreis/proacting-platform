"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge" 
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
    badgeText?: string
  }[]
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = useCallback((itemTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setHoveredItem(itemTitle)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null)
      timeoutRef.current = null
    }, 1000)
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.badgeText) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="opacity-60 cursor-default hover:bg-transparent focus:ring-0 justify-start"
                  disabled
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

          const isHovered = hoveredItem === item.title
          
          return (
            <div key={item.title} className="transition-all duration-200 ease-in-out">
              <Collapsible 
                asChild 
                open={isHovered}
                className="group/collapsible"
              >
                <SidebarMenuItem
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                  className="transition-all duration-200 ease-in-out"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      isActive={item.isActive}
                      asChild
                      className="transition-all duration-200 ease-in-out"
                    >
                      <a 
                        href={item.url}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="transition-all duration-200 ease-in-out"
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-all duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                      </a>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent 
                    className="transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden"
                    onMouseEnter={() => handleMouseEnter(item.title)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <SidebarMenuSub className="transition-all duration-200 ease-in-out">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} className="transition-all duration-150 ease-in-out">
                          <SidebarMenuSubButton asChild className="transition-all duration-150 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
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
            </div>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
