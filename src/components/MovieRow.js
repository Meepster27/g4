import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';

const TRACK_H = 4;
const THUMB_MIN = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.12)';
const THUMB_COLOR = '#01d277';

export default function MovieRow({ data, onPressMovie, contentContainerStyle }) {
  const [scrollX, setScrollX] = useState(0);
  const [contentW, setContentW] = useState(0);
  const [viewW, setViewW] = useState(0);

  const showBar = contentW > viewW && viewW > 0;
  const trackW = viewW - 8;
  const thumbW = showBar ? Math.max(THUMB_MIN, trackW * (viewW / contentW)) : 0;
  const maxScroll = contentW - viewW;
  const thumbLeft = showBar && maxScroll > 0 ? (scrollX / maxScroll) * (trackW - thumbW) : 0;

  return (
    <View
      style={styles.wrapper}
      onLayout={(e) => setViewW(e.nativeEvent.layout.width)}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: 14 }, contentContainerStyle]}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
        onContentSizeChange={(w) => setContentW(w)}
        renderItem={({ item, index }) => (
          <MovieCard
            movie={item}
            index={index}
            onPress={() => onPressMovie(item)}
          />
        )}
      />

      {showBar && (
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.thumb, { width: thumbW, left: thumbLeft }]} />
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
