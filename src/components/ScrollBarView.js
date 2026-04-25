import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

const TRACK_WIDTH = 6;
const THUMB_MIN_HEIGHT = 36;
const TRACK_COLOR = 'rgba(255,255,255,0.12)';
const THUMB_COLOR = '#01d277';

export default function ScrollBarView({ children, style, contentContainerStyle, scrollViewRef, ...rest }) {
  const internalRef = useRef(null);
  const ref = scrollViewRef || internalRef;

  // { thumbHeight, thumbTop, showBar }
  const [bar, setBar] = useState({ thumbHeight: 0, thumbTop: 0, showBar: false });

  function compute(scrollY, totalHeight, visibleHeight) {
    if (totalHeight <= visibleHeight) {
      setBar({ thumbHeight: 0, thumbTop: 0, showBar: false });
      return;
    }
    const thumbHeight = Math.max(THUMB_MIN_HEIGHT, visibleHeight * (visibleHeight / totalHeight));
    const maxScroll = totalHeight - visibleHeight;
    const maxTop = visibleHeight - thumbHeight;
    const thumbTop = maxScroll > 0 ? (scrollY / maxScroll) * maxTop : 0;
    setBar({ thumbHeight, thumbTop, showBar: true });
  }

  function onScroll(e) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    compute(contentOffset.y, contentSize.height, layoutMeasurement.height);
  }

  function onContentSizeChange(_, contentHeight) {
    setBar((prev) => {
      const vh = prev._vh || 0;
      if (vh > 0) {
        const thumbHeight = Math.max(THUMB_MIN_HEIGHT, vh * (vh / contentHeight));
        const showBar = contentHeight > vh;
        return { thumbHeight: showBar ? thumbHeight : 0, thumbTop: 0, showBar, _vh: vh, _ch: contentHeight };
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
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    left: 2,
    width: TRACK_WIDTH,
    borderRadius: TRACK_WIDTH / 2,
    backgroundColor: THUMB_COLOR,
  },
});


const BAR_WIDTH = 4;
const BAR_MIN_HEIGHT = 30;
const BAR_COLOR = '#01d277';

export default function ScrollBarView({ children, style, contentContainerStyle, scrollViewRef, ...rest }) {
  const internalRef = useRef(null);
  const ref = scrollViewRef || internalRef;

  const [indicator, setIndicator] = useState({ height: 0, top: 0 });

  function onScroll(e) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollY = contentOffset.y;
    const totalHeight = contentSize.height;
    const visibleHeight = layoutMeasurement.height;

    if (totalHeight <= visibleHeight) {
      setIndicator({ height: 0, top: 0 });
      return;
    }

    const barHeight = Math.max(BAR_MIN_HEIGHT, visibleHeight * (visibleHeight / totalHeight));
    const maxScroll = totalHeight - visibleHeight;
    const maxTop = visibleHeight - barHeight;
    const top = maxScroll > 0 ? (scrollY / maxScroll) * maxTop : 0;

    setIndicator({ height: barHeight, top });
  }

  function onContentSizeChange(contentWidth, contentHeight) {
    // Trigger initial bar render without needing a scroll event
    const visibleHeight = indicator._visibleHeight || 0;
    if (visibleHeight > 0 && contentHeight > visibleHeight) {
      const barHeight = Math.max(BAR_MIN_HEIGHT, visibleHeight * (visibleHeight / contentHeight));
      setIndicator({ height: barHeight, top: 0, _visibleHeight: visibleHeight });
    }
  }

  function onLayout(e) {
    const visibleHeight = e.nativeEvent.layout.height;
    // Store visible height and show initial bar
    setIndicator((prev) => {
      const totalHeight = prev._totalHeight || 0;
      if (totalHeight > visibleHeight) {
        const barHeight = Math.max(BAR_MIN_HEIGHT, visibleHeight * (visibleHeight / totalHeight));
        return { height: barHeight, top: 0, _visibleHeight: visibleHeight, _totalHeight: totalHeight };
      }
      return { ...prev, _visibleHeight: visibleHeight };
    });
  }

  function onScrollViewLayout(e) {
    // no-op kept for compat
  }

  function onScrollWithTotalHeight(e) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollY = contentOffset.y;
    const totalHeight = contentSize.height;
    const visibleHeight = layoutMeasurement.height;

    if (totalHeight <= visibleHeight) {
      setIndicator({ height: 0, top: 0, _visibleHeight: visibleHeight, _totalHeight: totalHeight });
      return;
    }

    const barHeight = Math.max(BAR_MIN_HEIGHT, visibleHeight * (visibleHeight / totalHeight));
    const maxScroll = totalHeight - visibleHeight;
    const maxTop = visibleHeight - barHeight;
    const top = maxScroll > 0 ? (scrollY / maxScroll) * maxTop : 0;

    setIndicator({ height: barHeight, top, _visibleHeight: visibleHeight, _totalHeight: totalHeight });
  }

  return (
    <View style={[styles.wrapper, style]} onLayout={onLayout}>
      <ScrollView
        ref={ref}
        style={styles.fill}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScroll={onScrollWithTotalHeight}
        onContentSizeChange={(w, h) => {
          setIndicator((prev) => {
            const vh = prev._visibleHeight || 0;
            if (vh > 0 && h > vh) {
              const barHeight = Math.max(BAR_MIN_HEIGHT, vh * (vh / h));
              return { height: barHeight, top: 0, _visibleHeight: vh, _totalHeight: h };
            }
            return { ...prev, _totalHeight: h };
          });
        }}
        scrollEventThrottle={16}
        {...rest}
      >
        {children}
      </ScrollView>

      {indicator.height > 0 && (
        <View style={[styles.bar, { height: indicator.height, top: indicator.top }]} />
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
  bar: {
    position: 'absolute',
    right: 2,
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    backgroundColor: BAR_COLOR,
  },
});
