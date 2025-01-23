import { FC } from "react"
import styled from "styled-components"
import EditorWrapper from "./EditorWrapper"

import { ToolbarProvider } from "@/components/providers/toolbar-provider"

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
  padding: 50px;
  display: flex;
  justify-content: center;
`

const App: FC = () => {
  return (
    <AppWrapper>
      <ToolbarProvider>
        <EditorWrapper />
      </ToolbarProvider>
    </AppWrapper>
  )
}

export default App
