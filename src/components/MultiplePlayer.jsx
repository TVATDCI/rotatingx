import { useState, useRef } from "react";
import PropTypes from "prop-types";

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
    if (index === currentTrackIndex) return; // Prevent changing to the same track
    audioRef.current.pause(); // Stop the current track
    setIsPlaying(false); // Reset play state
    setCurrentTrackIndex(index); // Update the track index
    audioRef.current = new Audio(audioSources[index]); // Load new track
  };

  return (
    <div className="multiPlayerContainer">
      <button className="play-pauseButton" onClick={togglePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        {audioSources.map((source, index) => (
          <button
            className="multiTracks"
            key={index}
            onClick={() => changeTrack(index)}
            disabled={index === currentTrackIndex}
          >
            Track {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

MultiplePlayer.propTypes = {
  audioSources: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MultiplePlayer;
