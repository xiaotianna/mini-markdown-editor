import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    color: string;
    borderColor: string;
    silderHelpTitleColor: string;
    silderHelpTextColor: string;
    statusColor: string;
    toolbarHoverBg: string;
    scrollbarThumbBgColor: string;
    scrollbarTrackBgColor: string;
  }
}
