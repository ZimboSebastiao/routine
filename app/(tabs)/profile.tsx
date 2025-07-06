import UserAvatar from '@/components/UserAvatar';
import { getUserName } from '@/utils/onboarding';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await getUserName();
        setUserName(name);
      } catch (error) {
        console.error('Error loading user name:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserName();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6B1E9C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <UserAvatar 
          size={160}
          defaultColor="#6B1E9C"
          editable={true}
        />
        <Text style={styles.userName}>
          {userName || 'Usuário'}
        </Text>
        <Text style={styles.userTitle}>Membro Premium</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialIcons name="local-activity" size={24} color="#6B1E9C" />
          <Text style={styles.statLabel}>Atividades</Text>
        </View>
        
        <View style={styles.statItem}>
          <Feather name="award" size={24} color="#6B1E9C" />
          <Text style={styles.statLabel}>Conquistas</Text>
        </View>
        
        <View style={styles.statItem}>
          <FontAwesome name="calendar-check-o" size={24} color="#6B1E9C" />
          <Text style={styles.statLabel}>Presença</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Organize e Evolua</Text>
        <Text style={styles.infoText}>
          Organize seu dia e alcance mais. 
		  Pequenos hábitos constroem grandes resultados. 
		  Sua rotina define seu sucesso.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F2EF",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginVertical: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userTitle: {
    marginTop: 5,
    fontSize: 16,
    color: '#6B1E9C',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
	fontWeight: "bold",
  },
  infoSection: {
    marginBottom: 25,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#FFEBE5',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#6B1E9C',
    fontSize: 14,
  },
});