import PlayIcon from "./svg/play.svg"
import BarIcon from "./svg/bar.svg"
import BellIcon from "./svg/bell.svg"
import CherryIcon from "./svg/cherry.svg"
import OrangeIcon from "./svg/orange.svg"
import PlumIcon from "./svg/plum.svg"
import SevenIcon from "./svg/seven.svg"
import NotFoundIcon from "./svg/not_found.svg"
import StopIcon from "./svg/stop.svg"

const icons = {
    "not_found": NotFoundIcon,
    "play": PlayIcon,
    "bar": BarIcon,
    "bell": BellIcon,
    "cherry": CherryIcon,
    "orange": OrangeIcon,
    "plum": PlumIcon,
    "seven": SevenIcon,
    "stop": StopIcon
}

const get_svg_component = (name) => {
    if (!(name in icons)) {
        return icons["not_found"];
    }
    return icons[name];
}

export default get_svg_component;