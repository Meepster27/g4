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
    const thumbHeight = Math.max(THUMB_MIN_HEIGHT, visibleHeight * (visibleHeight / totalHeight));
    const maxScroll = totalHeight - visibleHeight;
    const maxTop = visibleHeight - thumbHeight;
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
        const thumbHeight = Math.max(THUMB_MIN_HEIGHT, vh * (vh / contentHeight));
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
        const thumbHeight = Math.max(THUMB_MIN_HEIGHT, vh * (vh / ch));
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
    flexDirection: 'row',
  },
  fill: {
    flex: 1,
  },
  track: {
    width: TRACK_WIDTH + 4,
    backgroundColor: TRACK_COLOR,
    borderRadius: (TRACK_WIDTH + 4) / 2,
    marginVertical: 4,
    marginRight: 2,
  },
  thumb: {
    position: 'absolute',
    left: 2,
    width: TRACK_WIDTH,
    borderRadius: TRACK_WIDTH / 2,
    backgroundColor: THUMB_COLOR,
  },
});
