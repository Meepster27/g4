import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

const TRACK_WIDTH = 6;
const THUMB_MIN_HEIGHT = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.12)';
const THUMB_COLOR = '#01d277';

export default function ScrollBarView({ children, style, contentContainerStyle, scrollViewRef, ...rest }) {
  const internalRef = useRef(null);
  const ref = scrollViewRef || internalRef;

  const [bar, setBar] = useState({ thumbHeight: 0, thumbTop: 0, showBar: false });

  function compute(scrollY, totalHeight, visibleHeight) {
    if (totalHeight <= visibleHeight) {
      setBar((p) => ({ ...p, showBar: false }));
      return;
    }
    const trackHeight = visibleHeight - 8; // account for top:4 + bottom:4
    const thumbHeight = Math.max(THUMB_MIN_HEIGHT, trackHeight * (visibleHeight / totalHeight));
    const maxScroll = totalHeight - visibleHeight;
    const maxTop = trackHeight - thumbHeight;
    const thumbTop = maxScroll > 0 ? (scrollY / maxScroll) * maxTop : 0;
    setBar((p) => ({ ...p, thumbHeight, thumbTop, showBar: true }));
  }

  function onScroll(e) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    compute(contentOffset.y, contentSize.height, layoutMeasurement.height);
  }

  function onContentSizeChange(_, contentHeight) {
    setBar((prev) => {
      const vh = prev._vh || 0;
      if (vh > 0 && contentHeight > vh) {
        const trackHeight = vh - 8;
        const thumbHeight = Math.max(THUMB_MIN_HEIGHT, trackHeight * (vh / contentHeight));
        return { thumbHeight, thumbTop: 0, showBar: true, _vh: vh, _ch: contentHeight };
      }
      return { ...prev, _ch: contentHeight };
    });
  }

  function onLayout(e) {
    const vh = e.nativeEvent.layout.height;
    setBar((prev) => {
      const ch = prev._ch || 0;
      if (ch > 0 && ch > vh) {
        const trackHeight = vh - 8;
        const thumbHeight = Math.max(THUMB_MIN_HEIGHT, trackHeight * (vh / ch));
        return { thumbHeight, thumbTop: 0, showBar: true, _vh: vh, _ch: ch };
      }
      return { ...prev, _vh: vh };
    });
  }

  return (
    <View style={[styles.wrapper, style]} onLayout={onLayout}>
      <ScrollView
        ref={ref}
        style={styles.fill}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        scrollEventThrottle={16}
        {...rest}
      >
        {children}
      </ScrollView>

      {bar.showBar && (
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.thumb, { height: bar.thumbHeight, top: bar.thumbTop }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  fill: {
    flex: 1,
  },
  track: {
    position: 'absolute',
    right: 2,
    top: 4,
    bottom: 4,
    width: TRACK_WIDTH + 4,
    backgroundColor: TRACK_COLOR,
    borderRadius: (TRACK_WIDTH + 4) / 2,
  },
  thumb: {
    position: 'absolute',
    left: 2,
    width: TRACK_WIDTH,
    borderRadius: TRACK_WIDTH / 2,
    backgroundColor: THUMB_COLOR,
  },
});
