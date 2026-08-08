import { useContext } from "react";
import { QuickLaunchContext } from "../context/quickLaunch";

export function useQuickLaunch() {
  const ctx = useContext(QuickLaunchContext);
  if (!ctx) {
    throw new Error("useQuickLaunch must be used inside <QuickLaunchProvider>");
  }
  return ctx;
}
