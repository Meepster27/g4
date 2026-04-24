import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

const BAR_WIDTH = 4;
const BAR_MIN_HEIGHT = 30;
const BAR_COLOR = '#01d277';

/**
 * A ScrollView wrapper that renders a persistent custom scroll bar on the right.
 * Props are forwarded to ScrollView. Use `scrollViewRef` to access the inner ref.
 */
export default function ScrollBarView({ children, style, contentContainerStyle, scrollViewRef, ...rest }) {
  const internalRef = useRef(null);
  const ref = scrollViewRef || internalRef;

  const [indicator, setIndicator] = useState({ height: BAR_MIN_HEIGHT, top: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [visible, setVisible] = useState(false);
  const fadeTimer = useRef(null);

  function showBar() {
    setVisible(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => setVisible(false), 1200);
  }

  function onLayout(e) {
    setContainerHeight(e.nativeEvent.layout.height);
  }

  function onScroll(e) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollY = contentOffset.y;
    const totalHeight = contentSize.height;
    const visibleHeight = layoutMeasurement.height;

    if (totalHeight <= visibleHeight) {
      setIndicator({ height: 0, top: 0 });
      return;
    }

    const ratio = visibleHeight / totalHeight;
    const barHeight = Math.max(BAR_MIN_HEIGHT, visibleHeight * ratio);
    const maxScroll = totalHeight - visibleHeight;
    const maxTop = visibleHeight - barHeight;
    const top = (scrollY / maxScroll) * maxTop;

    setIndicator({ height: barHeight, top });
    showBar();
  }

  return (
    <View style={[styles.wrapper, style]} onLayout={onLayout}>
      <ScrollView
        ref={ref}
        style={styles.fill}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        {...rest}
      >
        {children}
      </ScrollView>

      {indicator.height > 0 && visible && (
        <View
          style={[
            styles.bar,
            { height: indicator.height, top: indicator.top },
          ]}
        />
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
