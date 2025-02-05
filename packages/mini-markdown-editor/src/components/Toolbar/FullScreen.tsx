import FullScreenIcon from "@/assets/images/fullscreen.svg?raw";
import ExitFullScreenIcon from "@/assets/images/exit-fullscreen.svg?raw";
import IconTooltip from "../base/IconTooltip";
import { useToolbarStore } from "@/store/toolbar";
import { Hotkey } from "@/common/hotkeys";

const FullScreen = () => {
  const { isFullScreen, setIsFullScreen } = useToolbarStore();

  return (
    <>
      <IconTooltip
        content={"全屏"}
        description={Hotkey.FULL_SCREEN.readableCommand}
        placement={isFullScreen ? "bottom" : "top"}
        onClick={() => setIsFullScreen(!isFullScreen)}
      >
        <div
          className="icon"
          dangerouslySetInnerHTML={{ __html: isFullScreen ? ExitFullScreenIcon : FullScreenIcon }}
        ></div>
      </IconTooltip>
    </>
  );
};

export default FullScreen;
