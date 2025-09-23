import { ChevronUp } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ScrollToTopButton = () => {
    const {isDark} = useTheme()
    return (
        <div className={`fixed right-0 bottom-0 rounded-md cursor-pointer z-50 ${
        isDark
            ? 'bg-space-600'
            : 'bg-white'
      } backdrop-blur-md`}
       onClick={() => {window.scrollTo(0, 0)}}
       >
            <ChevronUp className={`w-12 h-12 ${isDark?'text-white':'text-black'}`} />
        </div>
    );
}

export default ScrollToTopButton;
