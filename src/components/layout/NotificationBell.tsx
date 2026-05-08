import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const levelDot = {
  info: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-rose-500",
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground grid place-items-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-medium">Notifications</p>
          <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-border">
          {notifications.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground text-center">No notifications</p>
          )}
          {notifications.map((n) => (
            <button key={n.id} onClick={() => markRead(n.id)} className={cn("w-full text-left p-3 hover:bg-muted/40 transition-colors", !n.read && "bg-primary/[0.03]")}>
              <div className="flex items-start gap-2">
                <span className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", levelDot[n.level])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
