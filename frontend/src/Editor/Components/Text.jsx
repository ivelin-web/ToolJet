import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export const Text = function Text({ height, properties, styles }) {
  const [loadingState, setLoadingState] = useState(false);

  const { textColor, visibility, disabledState } = styles;
  const text = properties.text ?? '';
  const color = textColor;

  useEffect(() => {
    const loadingStateProperty = properties.loadingState;
    if (loadingStateProperty) {
      setLoadingState(loadingStateProperty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.loadingState]);

  const computedStyles = {
    color,
    height,
    display: visibility ? 'flex' : 'none',
    alignItems: 'center',
  };

  return (
    <div data-disabled={disabledState} className="text-widget" style={computedStyles}>
      {!loadingState && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />}
      {loadingState === true && (
        <div>
          <div className="skeleton-line w-10"></div>
        </div>
      )}
    </div>
  );
};
