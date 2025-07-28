import React, { useState, useEffect } from "react";

const TypedCursor = ({ text, typingSpeed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let typingTimeout;
    let cursorBlinkInterval;

    const typeText = (currentIndex) => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        typingTimeout = setTimeout(
          () => typeText(currentIndex + 1),
          typingSpeed
        );
      }
    };

    typeText(0);

    cursorBlinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(typingTimeout);
      clearInterval(cursorBlinkInterval);
    };
  }, [text, typingSpeed]);

  return (
    <span style={{ display: "inline-block" }}>
      {displayedText}
      {cursorVisible && <span style={styles.cursor}>|</span>}
    </span>
  );
};

const styles = {
  cursor: {
    display: "inline-block",
    width: "2px",
    backgroundColor: "black",
    marginLeft: "2px",
  },
};

export default TypedCursor;
