import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useData } from '../context/DataContext';
import { CitiesStackParamList, PeopleStackParamList } from '../navigation/RootNavigator';
import { ContactMethod, ContactPlatform, Tier } from '../data/models';

type AddEditPersonRouteProp = RouteProp<CitiesStackParamList & PeopleStackParamList, 'AddEditPerson'>;

interface ContactForm {
  id?: string;
  platform: ContactPlatform;
  value: string;
}

const tierOptions: Tier[] = ['GREEN', 'YELLOW', 'ARCHIVE'];

export default function AddEditPersonScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<AddEditPersonRouteProp>();
  const { personId, initialCityId } = route.params ?? {};
  const {
    people,
    cities,
    getContactMethodsForPerson,
    addPerson,
    updatePerson,
    addContactMethod,
    updateContactMethod,
    deleteContactMethod,
    addCity,
  } = useData();

  const editing = !!personId;
  const existingPerson = editing ? people.find(p => p.id === personId) : undefined;
  const [name, setName] = useState<string>(existingPerson?.name || '');
  const [primaryCityIdState, setPrimaryCityId] = useState<string | null>(existingPerson?.primaryCityId || initialCityId || null);
  const [additionalCityIds, setAdditionalCityIds] = useState<string[]>(existingPerson?.additionalCityIds || []);
  const [tier, setTier] = useState<Tier>(existingPerson?.tier || 'GREEN');
  const [notes, setNotes] = useState<string>(existingPerson?.notes || '');
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [newCityName, setNewCityName] = useState<string>('');
  const [showAdditionalCities, setShowAdditionalCities] = useState<boolean>(false);
  const [selectingPrimaryCity, setSelectingPrimaryCity] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<'primary' | 'additional' | null>(null);

  useEffect(() => {
    if (editing && personId) {
      const methods = getContactMethodsForPerson(personId).map(m => ({ id: m.id, platform: m.platform, value: m.value }));
      setContactForms(methods);
    } else {
      setContactForms([]);
    }
  }, [editing, personId]);

  // Save handler
  const handleSave = async () => {
    if (!name) {
      // Name can be blank but better to ask? We'll allow blank for MVP
    }
    // Validate: require at least one city? People missing city appear in Inbox; allowed; so no validation.
    let chosenPrimary = primaryCityIdState;
    // If user entered new city name, create new city
    if (newCityName.trim()) {
      const cityId = await addCity(newCityName.trim());
      chosenPrimary = cityId;
    }
    if (editing && existingPerson) {
      const updatedPerson = { ...existingPerson, name: name || null, primaryCityId: chosenPrimary, additionalCityIds, tier, notes: notes || null };
      await updatePerson(updatedPerson);
      // Handle contact methods: update existing, add new, delete removed
      const originalMethods = getContactMethodsForPerson(existingPerson.id);
      // Update or insert
      for (const form of contactForms) {
        if (form.value.trim() === '') continue;
        if (form.id) {
          // find in original to update
          await updateContactMethod({ id: form.id, personId: existingPerson.id, platform: form.platform, value: form.value, deepLink: '' });
        } else {
          await addContactMethod(existingPerson.id, form.platform, form.value);
        }
      }
      // Delete removed methods
      const newIds = contactForms.filter(f => f.id).map(f => f.id!);
      for (const m of originalMethods) {
        if (!newIds.includes(m.id)) {
          await deleteContactMethod(m.id);
        }
      }
      navigation.goBack();
    } else {
      // Insert new
      const personIdCreated = await addPerson({ name: name || null, primaryCityId: chosenPrimary || null, additionalCityIds, tier, notes: notes || null });
      // Contact methods
      for (const form of contactForms) {
        if (form.value.trim() === '') continue;
        await addContactMethod(personIdCreated, form.platform, form.value);
      }
      navigation.goBack();
    }
  };

  const handleAddContactMethod = () => {
    setContactForms(prev => [...prev, { platform: 'PHONE', value: '' }]);
  };
  const handleRemoveContactMethod = (index: number) => {
    setContactForms(prev => prev.filter((_, i) => i !== index));
  };
  const handleContactPlatformChange = (index: number, platform: ContactPlatform) => {
    setContactForms(prev => prev.map((cf, i) => (i === index ? { ...cf, platform } : cf)));
  };
  const handleContactValueChange = (index: number, value: string) => {
    setContactForms(prev => prev.map((cf, i) => (i === index ? { ...cf, value } : cf)));
  };

  // City selection UI: open modal for primary or additional
  const renderCityItem = ({ item }: { item: any }) => {
    const isSelectedPrimary = showModal === 'primary' && item.id === primaryCityIdState;
    const isSelectedAdditional = showModal === 'additional' && additionalCityIds.includes(item.id);
    const isSelected = isSelectedPrimary || isSelectedAdditional;
    return (
      <Pressable
        onPress={() => {
          if (showModal === 'primary') {
            setPrimaryCityId(item.id);
            setNewCityName('');
            setShowModal(null);
          } else if (showModal === 'additional') {
            if (additionalCityIds.includes(item.id)) {
              setAdditionalCityIds(prev => prev.filter(cid => cid !== item.id));
            } else {
              setAdditionalCityIds(prev => [...prev, item.id]);
            }
          }
        }}
        style={[styles.cityOption, isSelected && { backgroundColor: '#eee' }]}
      >
        <Text>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Primary City</Text>
        <Pressable
          onPress={() => setShowModal('primary')}
          style={styles.selector}
        >
          <Text>{
            newCityName
              ? newCityName
              : primaryCityIdState
              ? cities.find(c => c.id === primaryCityIdState)?.name
              : 'Select City'
          }</Text>
        </Pressable>
        {/* Add new city inline */}
        <TextInput
          value={newCityName}
          onChangeText={setNewCityName}
          style={styles.input}
          placeholder="Or enter new city name"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Additional Cities</Text>
        <Pressable
          onPress={() => setShowModal('additional')}
          style={styles.selector}
        >
          <Text>{additionalCityIds.length > 0 ? `${additionalCityIds.length} selected` : 'Select additional cities'}</Text>
        </Pressable>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tier</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tier}
            onValueChange={(value) => setTier(value as Tier)}
            style={{ flex: 1 }}
          >
            {tierOptions.map(t => (
              <Picker.Item label={t} value={t} key={t} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, { height: 80 }]} 
          placeholder="Add notes"
          multiline
        />
      </View>
      <View style={styles.formGroup}>
        <View style={styles.contactHeader}>
          <Text style={styles.label}>Contact Methods</Text>
          <Pressable onPress={handleAddContactMethod}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </Pressable>
        </View>
        {contactForms.map((cf, index) => (
          <View key={index} style={styles.contactRow}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={cf.platform}
                onValueChange={(value) => handleContactPlatformChange(index, value as ContactPlatform)}
                style={{ width: 120 }}
              >
                <Picker.Item label="Phone" value="PHONE" />
                <Picker.Item label="SMS" value="SMS" />
                <Picker.Item label="Instagram" value="INSTAGRAM" />
                <Picker.Item label="WhatsApp" value="WHATSAPP" />
                <Picker.Item label="Telegram" value="TELEGRAM" />
                <Picker.Item label="LinkedIn" value="LINKEDIN" />
                <Picker.Item label="TikTok" value="TIKTOK" />
                <Picker.Item label="Email" value="EMAIL" />
              </Picker>
            </View>
            <TextInput
              value={cf.value}
              onChangeText={(text) => handleContactValueChange(index, text)}
              style={[styles.input, { flex: 1, marginHorizontal: 8 }]}
              placeholder="Value"
            />
            <Pressable onPress={() => handleRemoveContactMethod(index)} style={styles.removeButton}>
              <Ionicons name="trash" size={20} color="#ff3b30" />
            </Pressable>
          </View>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
      {/* City selection modal */}
      <Modal visible={showModal !== null} animationType="slide" onRequestClose={() => setShowModal(null)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{showModal === 'primary' ? 'Select Primary City' : 'Select Additional Cities'}</Text>
            <Pressable onPress={() => setShowModal(null)} style={{ padding: 8 }}>
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
          {showModal === 'additional' && (
            <Pressable
              onPress={() => setShowModal(null)}
              style={styles.doneButton}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    padding: 4,
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
  doneButton: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    margin: 16,
    borderRadius: 4,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});