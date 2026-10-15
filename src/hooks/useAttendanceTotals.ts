import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceTotals {
  students: number;
  confirmations: number;
  events: Record<string, number>;
}

export function useAttendanceTotals() {
  return useQuery({
    queryKey: ["attendance-totals"],
    queryFn: async (): Promise<AttendanceTotals> => {
      const { data, error } = await supabase.rpc("get_attendance_totals");
      if (error) throw error;
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid totals");
      return data as unknown as AttendanceTotals;
    },
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}