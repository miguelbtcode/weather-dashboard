import { Share, Settings, Minimize2, Maximize2 } from "lucide-react";

const SectionControls = ({
  title,
  isExpanded,
  onToggle,
  onSettings,
  onShare,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
        <span>{title}</span>
        <span className="text-white/60 text-sm font-normal">
          {isExpanded ? "Expanded view" : "Compact view"}
        </span>
      </h2>

      <div className="flex items-center space-x-2">
        <button
          onClick={onShare}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 text-white/70 hover:text-white"
          title="Share weather data"
        >
          <Share size={18} />
        </button>

        <button
          onClick={onSettings}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 text-white/70 hover:text-white"
          title="Section settings"
        >
          <Settings size={18} />
        </button>

        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 text-white"
        >
          {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          <span className="text-sm">{isExpanded ? "Collapse" : "Expand"}</span>
        </button>
      </div>
    </div>
  );
};

export default SectionControls;
