import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';

const TRACK_W = 6;
const THUMB_MIN = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.18)';
const THUMB_COLOR = '#f5c518';

export default function ScrollBarView({ children, style, contentContainerStyle, scrollViewRef, ...rest }) {
  const internalRef = useRef(null);
  const ref = scrollViewRef || internalRef;

  const [scrollY, setScrollY] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [viewH, setViewH] = useState(0);
  const [trackH, setTrackH] = useState(0);

  const canScroll = contentH > viewH && viewH > 0 && trackH > 0;
  const thumbH = canScroll ? Math.max(THUMB_MIN, trackH * (viewH / contentH)) : 0;
  const thumbTop = canScroll ? (scrollY / (contentH - viewH)) * (trackH - thumbH) : 0;

  if (Platform.OS === 'web') {
    return (
      <ScrollView
        ref={ref}
        style={[styles.fill, style, styles.webScroll]}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        {...rest}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[styles.wrapper, style]}
      onLayout={(e) => setViewH(e.nativeEvent.layout.height)}
    >
      <ScrollView
        ref={ref}
        style={styles.fill}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        onContentSizeChange={(_, h) => setContentH(h)}
        {...rest}
      >
        {children}
      </ScrollView>

      <View style={styles.trackOuter}>
        <View
          style={styles.track}
          onLayout={(e) => setTrackH(e.nativeEvent.layout.height)}
        >
          {canScroll && (
            <View style={[styles.thumb, { height: thumbH, top: thumbTop }]} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webScroll: {
    overflowY: 'scroll',
    scrollbarWidth: 'thin',
    scrollbarColor: `${THUMB_COLOR} rgba(255,255,255,0.1)`,
  },
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
    paddingVertical: 4,
    paddingRight: 2,
  },
  track: {
    flex: 1,
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
