import { useRef, useEffect, useState } from "react";
import styled from "styled-components";

// Styled-components for cosmic styling
const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  z-index: 1000;
`;

const PlayPauseButton = styled.button`
  background: radial-gradient(
    circle,
    rgba(212, 175, 55, 0.9) 0%,
    rgba(212, 175, 55, 0.1) 100%
  );
  color: transparent;
  border: none;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(212, 175, 55, 0.5);
  transition: transform 0.8s ease, box-shadow 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    fill: url(#gradient);
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 8px 30px rgba(212, 175, 55, 0.9);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const MiniPlayerX = () => {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const widget = window.SC.Widget(iframeRef.current);

    // Update play state when the player starts/stops
    widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true));
    widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));

    // Cleanup listeners on unmount
    return () => {
      widget.unbind(window.SC.Widget.Events.PLAY);
      widget.unbind(window.SC.Widget.Events.PAUSE);
    };
  }, []);

  const togglePlayPause = () => {
    const widget = window.SC.Widget(iframeRef.current);

    // Ensure AudioContext resumes
    if (window.AudioContext && AudioContext.state === "suspended") {
      AudioContext.resume().then(() => {
        if (isPlaying) {
          widget.pause();
        } else {
          widget.play();
        }
      });
    } else {
      if (isPlaying) {
        widget.pause();
      } else {
        widget.play();
      }
    }
  };

  return (
    <PlayerContainer>
      {/* Hidden iframe for SoundCloud widget */}
      <iframe
        ref={iframeRef}
        style={{ display: "none" }} // Hide the default player
        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/iniwanko/sets/approachingtheunknown&auto_play=false"
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
      ></iframe>

      {/* Custom Play/Pause Button */}
      <PlayPauseButton onClick={togglePlayPause}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#ffffff", stopOpacity: 0.1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#000000", stopOpacity: 0.8 }}
              />
            </linearGradient>
          </defs>
          {isPlaying ? (
            <>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </>
          ) : (
            <polygon points="5,3 19,12 5,21" />
          )}
        </svg>
      </PlayPauseButton>
    </PlayerContainer>
  );
};

export default MiniPlayerX;
