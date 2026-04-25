import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MovieCard from './MovieCard';

const TRACK_H = 4;
const THUMB_MIN = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.18)';
const THUMB_COLOR = '#01d277';

export default function MovieRow({ data, onPressMovie, contentContainerStyle }) {
  const [scrollX, setScrollX] = useState(0);
  const [contentW, setContentW] = useState(0);
  const [viewW, setViewW] = useState(0);

  const trackW = Math.max(0, viewW - 8);
  const showBar = contentW > viewW && trackW > 0;
  const thumbW = showBar ? Math.max(THUMB_MIN, trackW * (viewW / contentW)) : 0;
  const maxScroll = contentW - viewW;
  const thumbLeft = showBar && maxScroll > 0 ? (scrollX / maxScroll) * (trackW - thumbW) : 0;

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        onLayout={(e) => setViewW(e.nativeEvent.layout.width)}
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

      <View style={styles.trackOuter}>
        {showBar && (
          <View style={[styles.track, { width: trackW }]}>
            <View style={[styles.thumb, { width: thumbW, left: thumbLeft }]} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  trackOuter: {
    height: TRACK_H + 4,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  track: {
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
