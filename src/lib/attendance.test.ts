import { describe, expect, it } from "vitest";
import { uniqueConfirmations } from "./attendance";

describe("unique event confirmations", () => {
  it("counts a student once per event and preserves the newest record", () => {
    const rows = [
      { event_title: "Workshop", student_id: " 100 ", name: "newest" },
      { event_title: "Workshop", student_id: "100", name: "older" },
      { event_title: "Seminar", student_id: "100", name: "other event" },
      { event_title: "Workshop", student_id: "200", name: "other student" },
    ];
    expect(uniqueConfirmations(rows).map(row => row.name)).toEqual(["newest", "other event", "other student"]);
  });
  it("handles empty attendance", () => {
    expect(uniqueConfirmations([])).toEqual([]);
  });
});