import type { DayStatus } from "@/src/lib/week";
import type { DumbbellLook } from "./rack";

interface StatusMeta {
  label: string;
  /** Shown when the day has no sessions to list. */
  hint: string;
  look: DumbbellLook;
  /** Text colour for the label. */
  tone: string;
  /** Left rule colour of the day readout. */
  rule: string;
}

/** Single source of truth for how each day state reads and looks. */
export const STATUS_META: Record<DayStatus, StatusMeta> = {
  done: {
    label: "Lifted",
    hint: "",
    look: "solid",
    tone: "text-chalk",
    rule: "border-chalk",
  },
  extra: {
    label: "Extra",
    hint: "",
    look: "accent",
    tone: "text-plate-blue",
    rule: "border-plate-blue",
  },
  missed: {
    label: "Missed",
    hint: "Planned. Never left the rack.",
    look: "hatch",
    tone: "text-plate-red",
    rule: "border-plate-red",
  },
  due: {
    label: "Due today",
    hint: "Waiting on the rack today. Not lifted yet.",
    look: "alert",
    tone: "text-plate-yellow",
    rule: "border-plate-yellow",
  },
  pending: {
    label: "Planned",
    hint: "Planned. Its day hasn't come.",
    look: "hollow",
    tone: "text-steel",
    rule: "border-steel",
  },
  rest: {
    label: "Rest",
    hint: "Nothing planned.",
    look: "empty",
    tone: "text-steel",
    rule: "border-iron",
  },
};

/** Order the legend reads in. */
export const STATUS_ORDER: DayStatus[] = ["done", "due", "pending", "missed", "extra", "rest"];
