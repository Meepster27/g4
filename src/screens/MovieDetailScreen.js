import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { fetchMovieDetails, IMAGE_BASE, BACKDROP_BASE } from '../api/tmdb';

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=No+Image';

export default function MovieDetailScreen({ route }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMovieDetails(movieId)
      .then(setMovie)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#01d277" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!movie) return null;

  const poster = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : PLACEHOLDER;
  const backdrop = movie.backdrop_path
    ? `${BACKDROP_BASE}${movie.backdrop_path}`
    : null;
  const year = movie.release_date?.slice(0, 4) ?? '';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : '';
  const genres = movie.genres?.map((g) => g.name).join('  ·  ') ?? '';
  const cast = movie.credits?.cast
    ?.slice(0, 6)
    .map((c) => c.name)
    .join(', ') ?? '';
  const director =
    movie.credits?.crew?.find((c) => c.job === 'Director')?.name ?? '';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      {/* Backdrop */}
      {backdrop ? (
        <ImageBackground
          source={{ uri: backdrop }}
          style={styles.backdrop}
          imageStyle={styles.backdropImage}
        >
          <View style={styles.backdropOverlay} />
        </ImageBackground>
      ) : (
        <View style={[styles.backdrop, { backgroundColor: '#032541' }]} />
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Poster + top info row */}
        <View style={styles.topRow}>
          <Image source={{ uri: poster }} style={styles.poster} />
          <View style={styles.topInfo}>
            <Text style={styles.title}>{movie.title}</Text>

            {/* Badges row */}
            <View style={styles.badges}>
              {year ? <Text style={styles.badge}>{year}</Text> : null}
              {runtime ? <Text style={styles.badge}>{runtime}</Text> : null}
              {movie.vote_average > 0 ? (
                <Text style={[styles.badge, styles.ratingBadge]}>
                  ⭐ {movie.vote_average.toFixed(1)}
                </Text>
              ) : null}
            </View>

            {genres ? (
              <Text style={styles.genres}>{genres}</Text>
            ) : null}
          </View>
        </View>

        {/* Tagline */}
        {movie.tagline ? (
          <Text style={styles.tagline}>"{movie.tagline}"</Text>
        ) : null}

        {/* Overview */}
        {movie.overview ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>OVERVIEW</Text>
            <Text style={styles.sectionText}>{movie.overview}</Text>
          </View>
        ) : null}

        {/* Director */}
        {director ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DIRECTOR</Text>
            <Text style={styles.sectionText}>{director}</Text>
          </View>
        ) : null}

        {/* Cast */}
        {cast ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CAST</Text>
            <Text style={styles.sectionText}>{cast}</Text>
          </View>
        ) : null}

        <View style={{ height: 32 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d1a',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    width: '100%',
    height: 200,
  },
  backdropImage: {
    resizeMode: 'cover',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,13,26,0.55)',
  },
  content: {
    flexDirection: 'column',
    gap: 20,
    padding: 16,
    marginTop: -40,
  },
  topRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  topInfo: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
    paddingTop: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    backgroundColor: 'rgba(3,37,65,0.9)',
    color: '#c8d4e0',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#2d4a6e',
    overflow: 'hidden',
  },
  ratingBadge: {
    color: '#f5c518',
    borderColor: '#f5c518',
  },
  genres: {
    color: '#01d277',
    fontSize: 12,
    lineHeight: 18,
  },
  tagline: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#01d277',
    paddingLeft: 12,
    lineHeight: 20,
  },
  section: {
    flexDirection: 'column',
    gap: 6,
  },
  sectionLabel: {
    color: '#01d277',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  sectionText: {
    color: '#c8d4e0',
    fontSize: 14,
    lineHeight: 22,
  },
});
