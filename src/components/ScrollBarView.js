import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

const TRACK_W = 6;
const THUMB_MIN = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.18)';
const THUMB_COLOR = '#01d277';

export default function ScrollBarView({ children, style, contentContainerStyle, scrollViewRef, ...rest }) {
  const internalRef = useRef(null);
  const ref = scrollViewRef || internalRef;

  const [scrollY, setScrollY] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [viewH, setViewH] = useState(0);

  const trackH = Math.max(0, viewH - 8);
  const showBar = contentH > viewH && trackH > 0;
  const thumbH = showBar ? Math.max(THUMB_MIN, trackH * (viewH / contentH)) : 0;
  const maxScroll = contentH - viewH;
  const thumbTop = showBar && maxScroll > 0 ? (scrollY / maxScroll) * (trackH - thumbH) : 0;

  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        ref={ref}
        style={styles.fill}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onLayout={(e) => setViewH(e.nativeEvent.layout.height)}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        onContentSizeChange={(_, h) => setContentH(h)}
        {...rest}
      >
        {children}
      </ScrollView>

      <View style={styles.trackOuter}>
        {showBar && (
          <View style={[styles.track, { height: trackH }]}>
            <View style={[styles.thumb, { height: thumbH, top: thumbTop }]} />
          </View>
        )}
      </View>
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
  trackOuter: {
    width: TRACK_W + 4,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingRight: 2,
  },
  track: {
    width: TRACK_W + 4,
    backgroundColor: TRACK_COLOR,
    borderRadius: (TRACK_W + 4) / 2,
  },
  thumb: {
    position: 'absolute',
    left: 2,
    width: TRACK_W,
    borderRadius: TRACK_W / 2,
    backgroundColor: THUMB_COLOR,
  },
});
