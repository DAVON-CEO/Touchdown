import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy & Permissions</Text>
      <Text style={styles.paragraph}>
        Touchdown is a privacy-first personal utility. All of your data is stored locally on your device.
        There is no server and no analytics. We do not scrape your contacts or monitor your interactions.
      </Text>
      <Text style={styles.paragraph}>
        Touchdown helps you remember people and timing, but it will never send messages on your behalf or automate any interactions.
      </Text>
      <Text style={styles.paragraph}>
        Optional features such as cloud sync may be added in the future. They will be disabled by default and encrypted end-to-end.
      </Text>
      <Text style={styles.header}>Permissions</Text>
      <Text style={styles.paragraph}>
        Touchdown does not require any special permissions to use. Notifications and location are disabled for now.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
});