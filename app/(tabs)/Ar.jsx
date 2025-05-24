import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AR Building Viewer</Text>
      <Link href="/ARViewer" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start AR Mode</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8 
  },
  buttonText: { color: 'white' }
});
