import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';

function formatAadhaarDisplay(digits = "") {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export default function LoginScreen() {
  const { credentials, updateCredentials, login } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();

  console.log("Login screen rendered", credentials, language);

  const onChangePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    updateCredentials({ phone: digits });
  };

  const onChangeAadhaar = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    updateCredentials({ aadhaar: digits });
  };

  const isPhoneValid = /^[6-9]\d{9}$/.test(credentials.phone);
  const isAadhaarValid = credentials.aadhaar.length === 12;
  // const isLanguageValid = language !== "";

  const handleLogin = () => {
    if (!isPhoneValid || !isAadhaarValid) {
      Alert.alert("Invalid", "Enter valid Phone, Aadhaar, and select a Language.");
      return;
    }
    login();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Welcome</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Phone (India)</Text>
        <View style={styles.phoneRow}>
          <View style={styles.countryBox}>
            <Text style={{ fontWeight: "600" }}>+91</Text>
          </View>
          <TextInput
            keyboardType="phone-pad"
            placeholder="Enter 10-digit phone"
            placeholderTextColor="#999"
            value={credentials.phone}
            onChangeText={onChangePhone}
            style={styles.phoneInput}
            maxLength={10}
          />
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Aadhaar number</Text>
        <TextInput
          keyboardType="number-pad"
          placeholder="XXXX XXXX XXXX"
          placeholderTextColor="#999"
          value={formatAadhaarDisplay(credentials.aadhaar)}
          onChangeText={onChangeAadhaar}
          style={styles.input}
          maxLength={14}
        />

        {/* Language Picker (from languageStore) */}
        {/* <Text style={[styles.label, { marginTop: 16 }]}>Preferred Language</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <Picker.Item label="-- Select --" value="en" />
            <Picker.Item label="Hindi" value="hi" />
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Punjabi" value="pa" />
          </Picker>
        </View> */}

        <TouchableOpacity
          style={[
            styles.loginButton,
            !(isPhoneValid && isAadhaarValid) && { opacity: 0.6 },
          ]}
          disabled={!(isPhoneValid && isAadhaarValid)} 
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  topBarTitle: { fontSize: 18, fontWeight: "bold" },

  form: { padding: 16, flex: 1, justifyContent: "center" },
  label: { fontSize: 14, marginBottom: 8, fontWeight: "600" },

  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryBox: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },

  input: {
    marginTop: 4,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#f9f9f9",
    marginTop: 4,
  },

  hint: { color: "#666", marginTop: 10, fontSize: 12 },

  loginButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  loginButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
