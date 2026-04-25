import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

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
