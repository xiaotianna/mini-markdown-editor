import FullScreenIcon from "@/assets/images/fullscreen.svg";
import ExitFullScreenIcon from "@/assets/images/exit-fullscreen.svg";
import IconTooltip from "../base/IconTooltip";
import { useToolbarStore } from "@/store/toolbar";

const FullScreen = () => {
  const isFullScreen = useToolbarStore((state) => state.isFullScreen);
  const setIsFullScreen = useToolbarStore((state) => state.setIsFullScreen);

  return (
    <>
      <IconTooltip content={"全屏"} onClick={() => setIsFullScreen(!isFullScreen)}>
        <img src={isFullScreen ? ExitFullScreenIcon : FullScreenIcon} alt={"全屏"} />
      </IconTooltip>
    </>
  );
};

export default FullScreen;
