import React, { useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useDisasterStore } from "../store/disasterStore";

interface MediaControllerProps {
  maxTimeSteps?: number;
  onTimeStepChange?: (step: number) => void;
}

export default function MediaController({
  maxTimeSteps = 12,
  onTimeStepChange,
}: MediaControllerProps) {
  const { currentTimeStep, isPlayingForecast, setCurrentTimeStep, setPlayingForecast } =
    useDisasterStore();

  // Auto-advance animation
  useEffect(() => {
    if (!isPlayingForecast) return;

    const interval = setInterval(() => {
      setCurrentTimeStep((currentTimeStep + 1) % maxTimeSteps);
    }, 500);

    return () => clearInterval(interval);
  }, [isPlayingForecast, currentTimeStep, maxTimeSteps, setCurrentTimeStep]);

  // Notify parent of time step changes
  useEffect(() => {
    onTimeStepChange?.(currentTimeStep);
  }, [currentTimeStep, onTimeStepChange]);

  const handlePlayPause = () => {
    setPlayingForecast(!isPlayingForecast);
  };

  const handleReset = () => {
    setCurrentTimeStep(0);
    setPlayingForecast(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeStep(parseInt(e.target.value));
    setPlayingForecast(false);
  };

  const hours = currentTimeStep;
  const minutes = Math.round((currentTimeStep % 1) * 60);

  return (
    <div className="w-full bg-slate-800 border-t border-slate-700 p-4 rounded-t-lg shadow-lg">
      <div className="max-w-full mx-auto space-y-3">
        {/* Title */}
        <div>
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wide">
            Forecasted Flood Spread
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Next 12 Hours Simulation • Current: {hours}h {minutes}m
          </p>
        </div>

        {/* Slider */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={maxTimeSteps}
            value={currentTimeStep}
            onChange={handleTimeChange}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            style={{
              background: `linear-gradient(to right, rgb(217, 119, 6) 0%, rgb(217, 119, 6) ${
                (currentTimeStep / maxTimeSteps) * 100
              }%, rgb(51, 65, 85) ${(currentTimeStep / maxTimeSteps) * 100}%, rgb(51, 65, 85) 100%)`,
            }}
          />
        </div>

        {/* Time markers */}
        <div className="flex justify-between text-xs text-slate-500">
          <span>Now</span>
          <span>6h</span>
          <span>12h</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
          </button>

          <button
            onClick={handlePlayPause}
            className={`
              flex-1 px-4 py-2 rounded-lg font-semibold text-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              ${
                isPlayingForecast
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-100"
              }
            `}
          >
            {isPlayingForecast ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play Forecast
              </>
            )}
          </button>

          <div className="text-right">
            <p className="text-xs font-semibold text-slate-300">{currentTimeStep}h</p>
            <p className="text-xs text-slate-500">of {maxTimeSteps}h</p>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-slate-400 italic">
          Watch the water spread and risk areas expand over the next 12 hours
        </div>
      </div>
    </div>
  );
}
