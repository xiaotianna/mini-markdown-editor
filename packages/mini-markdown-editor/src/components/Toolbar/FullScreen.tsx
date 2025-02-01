import FullScreenIcon from "@/assets/images/fullscreen.svg?raw";
import ExitFullScreenIcon from "@/assets/images/exit-fullscreen.svg?raw";
import IconTooltip from "../base/IconTooltip";
import { useToolbarStore } from "@/store/toolbar";

const FullScreen = () => {
  const isFullScreen = useToolbarStore((state) => state.isFullScreen);
  const setIsFullScreen = useToolbarStore((state) => state.setIsFullScreen);

  return (
    <>
      <IconTooltip content={"全屏"} onClick={() => setIsFullScreen(!isFullScreen)}>
        {/* <img src={isFullScreen ? ExitFullScreenIcon : FullScreenIcon} alt={"全屏"} /> */}
        <div
          className="icon"
          dangerouslySetInnerHTML={{ __html: isFullScreen ? ExitFullScreenIcon : FullScreenIcon }}
        ></div>
      </IconTooltip>
    </>
  );
};

export default FullScreen;
