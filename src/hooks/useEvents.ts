import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EventItem {
  id: string;
  title: string;
  event_date: string;
  venue: string;
  tag: string;
  image: string;
  description: string;
  created_at: string;
}

export const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<EventItem[]> => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 15000,
  });
