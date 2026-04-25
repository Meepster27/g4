import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';

const TRACK_H = 4;
const THUMB_MIN_W = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.12)';
const THUMB_COLOR = '#01d277';

export default function MovieRow({ data, onPressMovie, contentContainerStyle }) {
  const [bar, setBar] = useState({ thumbWidth: 0, thumbLeft: 0, showBar: false });

  function compute(scrollX, totalWidth, visibleWidth) {
    if (totalWidth <= visibleWidth) {
      setBar((p) => ({ ...p, showBar: false }));
      return;
    }
    const trackWidth = visibleWidth - 8;
    const thumbWidth = Math.max(THUMB_MIN_W, trackWidth * (visibleWidth / totalWidth));
    const maxScroll = totalWidth - visibleWidth;
    const maxLeft = trackWidth - thumbWidth;
    const thumbLeft = maxScroll > 0 ? (scrollX / maxScroll) * maxLeft : 0;
    setBar((p) => ({ ...p, thumbWidth, thumbLeft, showBar: true }));
  }

  function onScroll(e) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    compute(contentOffset.x, contentSize.width, layoutMeasurement.width);
  }

  function onContentSizeChange(contentWidth) {
    setBar((prev) => {
      const vw = prev._vw || 0;
      if (vw > 0 && contentWidth > vw) {
        const trackWidth = vw - 8;
        const thumbWidth = Math.max(THUMB_MIN_W, trackWidth * (vw / contentWidth));
        return { thumbWidth, thumbLeft: 0, showBar: true, _vw: vw, _cw: contentWidth };
      }
      return { ...prev, _cw: contentWidth };
    });
  }

  function onLayout(e) {
    const vw = e.nativeEvent.layout.width;
    setBar((prev) => {
      const cw = prev._cw || 0;
      if (cw > 0 && cw > vw) {
        const trackWidth = vw - 8;
        const thumbWidth = Math.max(THUMB_MIN_W, trackWidth * (vw / cw));
        return { thumbWidth, thumbLeft: 0, showBar: true, _vw: vw, _cw: cw };
      }
      return { ...prev, _vw: vw };
    });
  }

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: 14 }, contentContainerStyle]}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <MovieCard
            movie={item}
            index={index}
            onPress={() => onPressMovie(item)}
          />
        )}
      />

      {bar.showBar && (
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.thumb, { width: bar.thumbWidth, left: bar.thumbLeft }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 2,
    height: TRACK_H + 4,
    backgroundColor: TRACK_COLOR,
    borderRadius: (TRACK_H + 4) / 2,
  },
  thumb: {
    position: 'absolute',
    top: 2,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: THUMB_COLOR,
  },
});
