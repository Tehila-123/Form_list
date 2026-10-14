import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

import { COLORS } from "./theme";
import { formatDate, formatFileSize, formatTime } from "./utils/format";
import FormField from "./components/FormField";
import CheckboxGroup from "./components/CheckboxGroup";
import RadioGroup from "./components/RadioGroup";
import DateTimeField from "./components/DateTimeField";
import FileUpload from "./components/FileUpload";

// Options used by the checkbox, radio and dropdown fields.
const HOBBY_OPTIONS = ["Coding", "Music", "Sports", "Reading"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const COUNTRY_OPTIONS = [
  "Rwanda",
  "Kenya",
  "Uganda",
  "Tanzania",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXPERIENCE_MIN = 0;
const EXPERIENCE_MAX = 10;

// A function (not a constant) so every reset returns fresh objects.
function createInitialForm() {
  return {
    fullName: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    about: "",
    attachment: null,
    hobbies: [],
    gender: "",
    country: "Rwanda",
    notifications: true,
    dateOfBirth: new Date(2000, 0, 1),
    contactTime: new Date(2000, 0, 1, 9, 0),
    experience: 5,
  };
}

// Turn any stored value into a short, readable string for the summary card.
function formatSummaryValue(value) {
  if (value === null || value === undefined) return "None";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "None";
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, nested]) => `${key}: ${nested}`)
      .join(" • ");
  }
  return String(value);
}

export default function App() {
  // All form values live in one structured state object.
  const [form, setForm] = useState(createInitialForm);

  // UI-only state.
  const [showPassword, setShowPassword] = useState(false);

  // Feedback + result state.
  const [validationMessage, setValidationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  // Update one field while keeping the rest of the form untouched.
  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  // Validate, then log and display every form value.
  const handleSubmit = () => {
    const fullName = form.fullName.trim();
    const email = form.email.trim();

    // --- Validation of required fields ---
    if (!fullName) {
      setValidationMessage("Please enter your full name.");
      setSuccessMessage("");
      setSubmittedData(null);
      return;
    }
    if (!email) {
      setValidationMessage("Please enter your email address.");
      setSuccessMessage("");
      setSubmittedData(null);
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setValidationMessage("Please enter a valid email address.");
      setSuccessMessage("");
      setSubmittedData(null);
      return;
    }

    // --- Collect all values into one object ---
    const formValues = {
      fullName,
      email,
      // Never log real passwords. This masks the value before printing it.
      password: "•".repeat(form.password.length),
      age: form.age,
      phone: form.phone,
      about: form.about,
      attachment: form.attachment
        ? {
            name: form.attachment.name,
            type: form.attachment.mimeType,
            size: formatFileSize(form.attachment.size),
            uri: form.attachment.uri,
          }
        : null,
      hobbies: form.hobbies,
      gender: form.gender,
      country: form.country,
      notificationsEnabled: form.notifications,
      dateOfBirth: formatDate(form.dateOfBirth),
      contactTime: formatTime(form.contactTime),
      experienceLevel: form.experience,
    };

    console.log("Submitted Form Details:", formValues);

    setSubmittedData(formValues);
    setValidationMessage("");
    setSuccessMessage(
      "Success! Your form was submitted and logged to the console."
    );
  };

  // Restore every field to its default value and clear messages.
  const handleReset = () => {
    setForm(createInitialForm());
    setShowPassword(false);
    setValidationMessage("");
    setSuccessMessage("");
    setSubmittedData(null);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Form Elements Demo</Text>
            <Text style={styles.subtitle}>
              Explore form inputs and submit your details.
            </Text>

            {/* 1. Text input - Full name (required) */}
            <FormField label="Full Name *">
              <TextInput
                style={styles.input}
                placeholder="e.g. John Doe"
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="words"
                value={form.fullName}
                onChangeText={(text) => updateField("fullName", text)}
              />
            </FormField>

            {/* 2. Email input (required) */}
            <FormField label="Email Address *">
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={form.email}
                onChangeText={(text) => updateField("email", text)}
              />
            </FormField>

            {/* 3. Password input with show/hide toggle */}
            <FormField label="Password">
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter a password"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={form.password}
                  onChangeText={(text) => updateField("password", text)}
                />
                <Pressable
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword((previous) => !previous)}
                  hitSlop={8}
                >
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>
            </FormField>

            {/* 4. Number input - Age */}
            <FormField label="Age">
              <TextInput
                style={styles.input}
                placeholder="e.g. 22"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                value={form.age}
                onChangeText={(text) => updateField("age", text)}
              />
            </FormField>

            {/* 5. Phone input */}
            <FormField label="Phone Number">
              <TextInput
                style={styles.input}
                placeholder="+250700000000"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => updateField("phone", text)}
              />
            </FormField>

            {/* 6. Multiline text input */}
            <FormField label="About Me">
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Tell us a little about yourself..."
                placeholderTextColor={COLORS.placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={form.about}
                onChangeText={(text) => updateField("about", text)}
              />
            </FormField>

            {/* File upload */}
            <FormField label="Upload a File (optional)">
              <FileUpload
                value={form.attachment}
                onChange={(file) => updateField("attachment", file)}
              />
            </FormField>

            {/* 7. Checkboxes - multiple selection */}
            <FormField label="Hobbies (select any)">
              <CheckboxGroup
                options={HOBBY_OPTIONS}
                selected={form.hobbies}
                onChange={(value) => updateField("hobbies", value)}
              />
            </FormField>

            {/* 8. Radio buttons - single selection */}
            <FormField label="Gender">
              <RadioGroup
                options={GENDER_OPTIONS}
                selected={form.gender}
                onChange={(value) => updateField("gender", value)}
              />
            </FormField>

            {/* 9. Dropdown / Picker */}
            <FormField label="Country">
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={form.country}
                  onValueChange={(value) => updateField("country", value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {COUNTRY_OPTIONS.map((country) => (
                    <Picker.Item
                      key={country}
                      label={country}
                      value={country}
                    />
                  ))}
                </Picker>
              </View>
            </FormField>

            {/* 10. Switch / Toggle */}
            <View style={styles.switchRow}>
              <View style={styles.switchLabelWrapper}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Text style={styles.helperText}>
                  {form.notifications
                    ? "Notifications are on"
                    : "Notifications are off"}
                </Text>
              </View>
              <Switch
                value={form.notifications}
                onValueChange={(value) => updateField("notifications", value)}
                trackColor={{
                  false: COLORS.switchTrackOff,
                  true: COLORS.primary,
                }}
                thumbColor={COLORS.switchThumb}
              />
            </View>

            {/* 11. Date picker - Date of birth */}
            <FormField label="Date of Birth">
              <DateTimeField
                mode="date"
                value={form.dateOfBirth}
                onChange={(date) => updateField("dateOfBirth", date)}
              />
            </FormField>

            {/* 12. Time picker - Preferred contact time */}
            <FormField label="Preferred Contact Time">
              <DateTimeField
                mode="time"
                value={form.contactTime}
                onChange={(time) => updateField("contactTime", time)}
              />
            </FormField>

            {/* 13. Slider - Programming experience */}
            <FormField label={`Programming Experience: ${form.experience}`}>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderEdge}>{EXPERIENCE_MIN}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={EXPERIENCE_MIN}
                  maximumValue={EXPERIENCE_MAX}
                  step={1}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.border}
                  thumbTintColor={COLORS.primary}
                  value={form.experience}
                  onValueChange={(value) => updateField("experience", value)}
                />
                <Text style={styles.sliderEdge}>{EXPERIENCE_MAX}</Text>
              </View>
            </FormField>

            {/* Validation + success feedback */}
            {validationMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{validationMessage}</Text>
              </View>
            ) : null}
            {successMessage ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* 14. Submit button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit &amp; Log Details</Text>
            </Pressable>

            {/* 15. Reset button */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.resetButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset Form</Text>
            </Pressable>

            {/* Submitted details summary */}
            {submittedData ? (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Submitted Details</Text>
                {Object.entries(submittedData).map(([key, value]) => (
                  <View key={key} style={styles.summaryRow}>
                    <Text style={styles.summaryKey}>{key}</Text>
                    <Text style={styles.summaryValue}>
                      {formatSummaryValue(value)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.label,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  multiline: {
    minHeight: 96,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  passwordToggle: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  passwordToggleText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 160 : 50,
    color: COLORS.text,
  },
  pickerItem: {
    color: COLORS.text,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchLabelWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderEdge: {
    fontSize: 12,
    color: COLORS.textMuted,
    width: 20,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "600",
  },
  successBox: {
    backgroundColor: COLORS.successBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resetButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  summaryCard: {
    marginTop: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  summaryKey: {
    fontSize: 13,
    color: COLORS.textMuted,
    width: 140,
    flexShrink: 0,
  },
  summaryValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
});
