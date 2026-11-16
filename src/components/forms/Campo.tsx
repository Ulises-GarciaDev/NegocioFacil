import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type KeyboardTypeOptions,
} from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
};

export default function Campo({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  error,
}: Props) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorTexto}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: { marginTop: 16 },
  label: { fontSize: 14, color: "#647572", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#172C2A",
  },
  inputError: { borderColor: "#DC2626" },
  errorTexto: { color: "#DC2626", fontSize: 13, marginTop: 6 },
});