import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { fetchList, LISTS } from '../api/tmdb';
import ScrollBarView from '../components/ScrollBarView';
import MovieRow from '../components/MovieRow';

export default function HomeScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const [listData, setListData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const results = await Promise.all(
          LISTS.map((l) =>
            fetchList(l.id).then((data) => ({ id: l.id, data }))
          )
        );
        const map = {};
        results.forEach(({ id, data }) => {
          map[id] = data;
        });
        setListData(map);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f5c518" />
        <Text style={styles.loadingText}>Loading lists…</Text>
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

  return (
    <ScrollBarView style={[styles.container, { height }]}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>🎬 Movie Lists</Text>
        <Text style={styles.heroSubtitle}>
          Curated family favourites, heartfelt dramas, and laugh-out-loud comedies.
        </Text>
      </View>

      {/* One section per list */}
      {LISTS.map((list) => {
        const movies = listData[list.id]?.results?.slice(0, 10) ?? [];
        return (
          <View key={list.id} style={styles.section}>
            {/* Section header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{list.name}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('List', {
                    listId: list.id,
                    listName: list.name,
                  })
                }
              >
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal scroll row */}
            <MovieRow
              data={movies}
              contentContainerStyle={styles.row}
              onPressMovie={(item) =>
                navigation.navigate('Detail', { movieId: item.id })
              }
            />
          </View>
        );
      })}

      <View style={styles.footer} />
    </ScrollBarView>
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
    gap: 12,
  },
  loadingText: {
    color: '#c8d4e0',
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  hero: {
    backgroundColor: '#032541',
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  heroTitle: {
    color: '#f5c518',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSubtitle: {
    color: '#c8d4e0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  section: {
    marginTop: 28,
    flexDirection: 'column',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#e0e0e0',
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    color: '#f5c518',
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  footer: {
    height: 32,
  },
});
