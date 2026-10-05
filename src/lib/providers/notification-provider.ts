// src/providers/notification-provider.tsx

"use client";

import { useEffect, useRef } from "react";
import { useNotifications, useUnreadCount } from "@/hooks/use-notifications";
import { setFaviconBadge } from "../favicon-badge";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: countRes } = useUnreadCount();
  const unreadCount = countRes?.data.count ?? 0;
  const prevCountRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

 
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.preload = "auto";

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      audioRef.current = null;
    };
  }, []);


  useEffect(() => {
    setFaviconBadge(unreadCount);

    document.title =
      unreadCount > 0
        ? `(${unreadCount}) Helpdesk`
        : "Helpdesk | IT Support Console";

  
    if (prevCountRef.current === null) {
      prevCountRef.current = unreadCount;
      return;
    }

    
    const didIncrease = unreadCount > prevCountRef.current;

    if (didIncrease) {
      audioRef.current?.play().catch(() => {});

      if (Notification.permission === "granted" && document.hidden) {
        new Notification("New helpdesk notification", {
          icon: "/favicon.ico",
        });
      }
    }

    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  return children;
}

