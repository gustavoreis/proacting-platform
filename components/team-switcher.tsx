"use client"
import Image from "next/image"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-white overflow-hidden">
            {" "}
            {/* Ensured rounded-full for circle */}
            <Image
              src="/proacting-favicon.svg" // Updated to new SVG
              alt="Proacting Logo"
              width={28} // Slightly adjusted for potentially different SVG viewbox, ensure it fits well
              height={28}
              className="size-7" // Adjusted class for potentially better fit
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Proacting</span>
            <span className="truncate text-xs">Platforma</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
