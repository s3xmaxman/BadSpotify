"use client";

import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Playlist, Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { RiPlayListFill } from "react-icons/ri";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
  playlists: Playlist[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs, playlists }) => {
  const pathname = usePathname();
  const player = usePlayer();
  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "ホーム",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "検索",
        active: pathname === "/search",
        href: "/search",
      },
      {
        icon: RiPlayListFill,
        label: "プレイリスト",
        active: pathname === "/playlist",
        href: "/playlist",
      },
    ],
    [pathname]
  );

  return (
    <div
      className={twMerge(
        `flex h-full`,
        player.activeId && "h-[calc(100%-80px)]"
      )}
    >
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} playlists={playlists} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  );
};

export default Sidebar;
