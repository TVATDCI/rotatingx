import { useState, useRef } from "react";
import PropTypes from "prop-types";
import FancyButton from "./FancyButton";

const MultiplePlayer = ({ audioSources }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(audioSources[currentTrackIndex]));

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
      <FancyButton 
        isPrimary 
        onClick={togglePlayPause}
        ariaLabel={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
      </FancyButton>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
  );
};

MultiplePlayer.propTypes = {
  audioSources: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MultiplePlayer;
