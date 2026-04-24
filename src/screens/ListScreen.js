import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { fetchList } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function ListScreen({ route, navigation }) {
  const { listId, listName } = route.params;
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(
    (p) => {
      setLoading(true);
      setError(null);
      fetchList(listId, p)
        .then((d) => setData(d))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    },
    [listId]
  );

  useEffect(() => {
    setPage(1);
    load(1);
  }, [listId, load]);

  const changePage = (next) => {
    setPage(next);
    load(next);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <View style={styles.container}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          {data?.total_results ?? 0} movies
        </Text>
        <Text style={styles.statsText}>
          Page {page} / {totalPages}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#01d277" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          indicatorStyle="white"
          renderItem={({ item, index }) => (
            <MovieCard
              movie={item}
              index={index}
              onPress={() =>
                navigation.navigate('Detail', { movieId: item.id })
              }
            />
          )}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
            onPress={() => page > 1 && changePage(page - 1)}
            disabled={page === 1}
          >
            <Text style={styles.pageBtnText}>← Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            {page} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageBtn,
              page === totalPages && styles.pageBtnDisabled,
            ]}
            onPress={() => page < totalPages && changePage(page + 1)}
            disabled={page === totalPages}
          >
            <Text style={styles.pageBtnText}>Next →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    flexDirection: 'column',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2d42',
  },
  statsText: {
    color: '#888',
    fontSize: 13,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  grid: {
    padding: 12,
    paddingBottom: 8,
  },
  row: {
    justifyContent: 'space-evenly',
    marginBottom: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e2d42',
  },
  pageBtn: {
    borderWidth: 1,
    borderColor: '#01d277',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  pageBtnDisabled: {
    borderColor: '#333',
    opacity: 0.4,
  },
  pageBtnText: {
    color: '#01d277',
    fontWeight: '600',
    fontSize: 13,
  },
  pageInfo: {
    color: '#c8d4e0',
    fontSize: 14,
  },
});
