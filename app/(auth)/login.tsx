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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { useLocationStore } from "@/store/locationStore";

function formatAadhaarDisplay(digits = "") {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export default function LoginScreen() {
  const { credentials, updateCredentials, login } = useAuthStore();
  const { language } = useLanguageStore();
  const { state, district } = useLocationStore()

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
      {/* Header with App Name */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="tractor" size={40} color="#065f46" />
        <Text style={styles.appName}>कृषि मित्र</Text>
      </View>

      {/* Detected Language & Location */}
      <View className="bg-green-100/80 border border-green-300 rounded-2xl p-4 mb-6 shadow-md">
        <View className="mb-2">
          <Text className="text-gray-600 font-medium text-lg text-center mb-5">Detected from your device</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="language-outline" size={18} color="#065f46" />
          <Text className="ml-2 text-green-800 font-semibold text-md">
            {`Device Language: ${language.charAt(0).toUpperCase() + language.slice(1) || "N/A"}`}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="location" size={18} color="#065f46" />
          <Text className="ml-2 text-green-800 font-semibold text-md">
            {`State: ${state || "--"}`}
          </Text>

        </View>
        <View className="flex-row items-center">
          <Ionicons name="pin" size={18} color="#FF0000" />
          <Text className="ml-2 text-green-800 font-semibold text-md">
            {`District: ${district || "--"}`}
          </Text>
        </View>
      </View>


      {/* Form Container */}
      <View style={styles.form}>
        {/* Phone Input */}
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputRow}>
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            keyboardType="phone-pad"
            placeholder="Enter 10-digit phone"
            placeholderTextColor="#999"
            value={credentials.phone}
            onChangeText={onChangePhone}
            style={styles.input}
            maxLength={10}
          />
          <Ionicons name="call-outline" size={20} color="#065f46" style={{ marginLeft: 8 }} />
        </View>

        {/* Aadhaar Input */}
        <Text style={[styles.label, { marginTop: 20 }]}>Aadhaar Number</Text>
        <View style={styles.inputRow}>
          <TextInput
            keyboardType="number-pad"
            placeholder="XXXX XXXX XXXX"
            placeholderTextColor="#999"
            value={formatAadhaarDisplay(credentials.aadhaar)}
            onChangeText={onChangeAadhaar}
            style={styles.input}
            maxLength={14}
          />
          <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#065f46" style={{ marginLeft: 8 }} />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton]}
          disabled={!(isPhoneValid && isAadhaarValid)}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
          <Ionicons name="arrow-forward-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", paddingHorizontal: 20 },

  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  appName: { fontSize: 40, fontWeight: "bold", color: "#065f46", marginLeft: 10 },

  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    padding: 12,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  locationText: { color: "#065f46", fontWeight: "600" },

  form: { flex: 1, justifyContent: "flex-start"},

  label: { fontSize: 14, marginBottom: 8, fontWeight: "600", color: "#065f46" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    borderRadius: 25,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  prefixBox: {
    backgroundColor: "#10b981",
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 8,
    borderRadius: 25,
  },
  prefixText: { color: "#fff", fontWeight: "600" },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#065f46",
  },

  loginButton: {
    flexDirection: "row",
    marginTop: 30,
    backgroundColor: "#065f46",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  loginButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
