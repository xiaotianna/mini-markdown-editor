import { ToolbarContext } from "@/components/providers/toolbar-provider"
import { useContext } from "react"

export const useToolbar = () => {
  const context = useContext(ToolbarContext)
  if(!context) {
    throw new Error("Toolbar init error")
  }
  return context
}