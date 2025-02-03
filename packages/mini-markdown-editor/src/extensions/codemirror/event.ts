import { EditorView, ViewPlugin } from "@uiw/react-codemirror";

interface EventOptions {
  scrollWrapper: string;
  eventExt?: ViewPlugin<{
    dom?: HTMLElement;
    view: EditorView;
    destroy(): void;
  }>;
}

export const createEventExtension = (eventOptions: EventOptions): any => {
  return eventOptions.scrollWrapper === "editor" ? eventOptions.eventExt : [];
};
