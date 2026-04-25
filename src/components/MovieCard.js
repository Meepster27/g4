import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { IMAGE_BASE } from '../api/tmdb';

const PLACEHOLDER = 'https://via.placeholder.com/150x225?text=No+Image';

export default function MovieCard({ movie, onPress }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : PLACEHOLDER;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.year}>{year}</Text>
          <Text style={styles.rating}>⭐ {rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  poster: {
    width: 140,
    height: 210,
    resizeMode: 'cover',
  },
  info: {
    padding: 8,
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    color: '#e0e0e0',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  year: {
    color: '#888',
    fontSize: 11,
  },
  rating: {
    color: '#f5c518',
    fontSize: 11,
  },
});
