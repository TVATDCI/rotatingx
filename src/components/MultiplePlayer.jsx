import { useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import FancyButton from "./FancyButton";

const MultiplePlayer = ({ audioSources, currentAtmosphere }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(audioSources[currentTrackIndex]));

  const coords = useMemo(() => {
    const rawLat = Math.random() * 180 - 90;
    const rawLon = Math.random() * 360 - 180;
    return {
      lat: Math.abs(rawLat).toFixed(4),
      lon: Math.abs(rawLon).toFixed(4),
      latDir: rawLat >= 0 ? "N" : "S",
      lonDir: rawLon >= 0 ? "E" : "W",
    };
  }, [currentAtmosphere]);

  const { lat, lon, latDir, lonDir } = coords;

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (index) => {
    if (index === currentTrackIndex) return;
    audioRef.current.pause();
    setIsPlaying(false);
    setCurrentTrackIndex(index);
    audioRef.current = new Audio(audioSources[index]);
  };

  return (
    <div className="multiPlayerContainer glass-panel">
      <div className="hud-panel-inner">
        <span className="corner-tl" />
        <span className="corner-tr" />
        <span className="corner-bl" />
        <span className="corner-br" />
        <p className="hud-status">
          ATMOSPHERE: {currentAtmosphere.toUpperCase()} | {lat}°{latDir} {lon}°
          {lonDir}
        </p>
        <FancyButton
          isPrimary
          onClick={togglePlayPause}
          ariaLabel={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
        </FancyButton>
        <div className="track-selector-row">
          {audioSources.map((_, index) => (
            <FancyButton
              key={index}
              onClick={() => changeTrack(index)}
              disabled={index === currentTrackIndex}
              px="12px"
              ariaLabel={`Select track ${index + 1}`}
            >
              {index + 1}
            </FancyButton>
          ))}
        </div>
      </div>
    </div>
  );
};

MultiplePlayer.propTypes = {
  audioSources: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentAtmosphere: PropTypes.string.isRequired,
};

export default MultiplePlayer;
