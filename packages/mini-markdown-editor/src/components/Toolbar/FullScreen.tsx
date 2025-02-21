import FullScreenIcon from "@/assets/images/fullscreen.svg?raw";
import ExitFullScreenIcon from "@/assets/images/exit-fullscreen.svg?raw";
import IconTooltip from "../base/IconTooltip";
import { useToolbarStore } from "@/store/toolbar";
import { Hotkey } from "@/common/hotkeys";
import { t, type TRANSLATION_KEYS } from "@/locales";
import { TOOLBAR_KEYS } from "@/locales/keys";

const FullScreen = () => {
  const { isFullScreen, setIsFullScreen } = useToolbarStore();

  return (
    <>
      <IconTooltip
        content={t(TOOLBAR_KEYS.TOOLBAR.fullscreen as TRANSLATION_KEYS)}
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
