import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Platform } from 'react-native';
import MovieCard from './MovieCard';

const TRACK_H = 4;
const THUMB_MIN = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.18)';
const THUMB_COLOR = '#01d277';

export default function MovieRow({ data, onPressMovie, contentContainerStyle }) {
  const [scrollX, setScrollX] = useState(0);
  const [contentW, setContentW] = useState(0);
  const [viewW, setViewW] = useState(0);
  const [trackW, setTrackW] = useState(0);

  const canScroll = contentW > viewW && viewW > 0 && trackW > 0;
  const thumbW = canScroll ? Math.max(THUMB_MIN, trackW * (viewW / contentW)) : 0;
  const thumbLeft = canScroll ? (scrollX / (contentW - viewW)) * (trackW - thumbW) : 0;

  if (Platform.OS === 'web') {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        style={{ overflowX: 'scroll', scrollbarWidth: 'thin', scrollbarColor: `${THUMB_COLOR} ${TRACK_COLOR}` }}
        renderItem={({ item, index }) => (
          <MovieCard movie={item} index={index} onPress={() => onPressMovie(item)} />
        )}
      />
    );
  }

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
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
        onContentSizeChange={(w) => setContentW(w)}
        renderItem={({ item, index }) => (
          <MovieCard movie={item} index={index} onPress={() => onPressMovie(item)} />
        )}
      />

      <View style={styles.trackOuter}>
        <View
          style={styles.track}
          onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
        >
          {canScroll && (
            <View style={[styles.thumb, { width: thumbW, left: thumbLeft }]} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  trackOuter: {
    alignSelf: 'stretch',
    height: TRACK_H + 4,
    paddingHorizontal: 4,
    paddingBottom: 2,
  },
  track: {
    flex: 1,
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
