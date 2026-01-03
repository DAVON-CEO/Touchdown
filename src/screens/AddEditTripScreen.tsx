import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList, Platform } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerEvent, default as DateTimePicker } from '@react-native-community/datetimepicker';
import { TripsStackParamList } from '../navigation/RootNavigator';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/date';

type AddEditTripRouteProp = RouteProp<TripsStackParamList, 'AddEditTrip'>;

export default function AddEditTripScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<AddEditTripRouteProp>();
  const { tripId } = route.params || {};
  const { trips, cities, addTrip, updateTrip, deleteTrip } = useData();
  const editing = !!tripId;
  const existingTrip = editing ? trips.find(t => t.id === tripId) : undefined;
  const [cityId, setCityId] = useState<string | null>(existingTrip?.cityId || null);
  const [startDate, setStartDate] = useState<Date>(existingTrip ? new Date(existingTrip.startDate) : new Date());
  const [endDate, setEndDate] = useState<Date>(existingTrip ? new Date(existingTrip.endDate) : new Date());
  const [showCityModal, setShowCityModal] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSave = async () => {
    if (!cityId) {
      // no city selected
      return;
    }
    const sDateISO = startDate.toISOString();
    const eDateISO = endDate.toISOString();
    if (editing && existingTrip) {
      await updateTrip({ ...existingTrip, cityId, startDate: sDateISO, endDate: eDateISO, source: 'MANUAL' });
    } else {
      await addTrip(cityId, sDateISO, eDateISO, 'MANUAL');
    }
    navigation.goBack();
  };

  const handleDelete = async () => {
    if (editing && tripId) {
      await deleteTrip(tripId);
      navigation.goBack();
    }
  };

  const onChangeStart = (event: DateTimePickerEvent, date?: Date) => {
    setShowStartPicker(false);
    if (date) setStartDate(date);
  };
  const onChangeEnd = (event: DateTimePickerEvent, date?: Date) => {
    setShowEndPicker(false);
    if (date) setEndDate(date);
  };

  const renderCityItem = ({ item }: { item: any }) => (
    <Pressable
      style={[styles.cityOption, cityId === item.id && { backgroundColor: '#eee' }]}
      onPress={() => {
        setCityId(item.id);
        setShowCityModal(false);
      }}
    >
      <Text>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>City</Text>
        <Pressable
          style={styles.selector}
          onPress={() => setShowCityModal(true)}
        >
          <Text>{cityId ? cities.find(c => c.id === cityId)?.name : 'Select City'}</Text>
        </Pressable>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Date</Text>
        <Pressable
          style={styles.selector}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{formatDate(startDate.toISOString())}</Text>
        </Pressable>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStart}
          />
        )}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>End Date</Text>
        <Pressable
          style={styles.selector}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{formatDate(endDate.toISOString())}</Text>
        </Pressable>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEnd}
          />
        )}
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
      {editing && (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Trip</Text>
        </Pressable>
      )}
      {/* City selection modal */}
      <Modal visible={showCityModal} animationType="slide" onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select City</Text>
            <Pressable onPress={() => setShowCityModal(false)} style={{ padding: 8 }}>
              <Ionicons name="close" size={24} />
            </Pressable>
          </View>
          <FlatList
            data={cities}
            keyExtractor={item => item.id}
            renderItem={renderCityItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={<Text style={styles.empty}>No cities available.</Text>}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cityOption: {
    padding: 16,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});