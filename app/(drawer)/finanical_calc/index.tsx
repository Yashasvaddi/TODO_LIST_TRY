import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function FinancialCalculatorScreen() {
  const cropCostData = [
    { crop: 'Rice', seeds: 2500, fertilizer: 8000, pesticide: 3000, labor: 12000, machinery: 5000, irrigation: 2000, total: 32500 },
    { crop: 'Wheat', seeds: 3000, fertilizer: 7500, pesticide: 2500, labor: 10000, machinery: 4500, irrigation: 1800, total: 29300 },
    { crop: 'Maize', seeds: 2800, fertilizer: 6500, pesticide: 2800, labor: 9500, machinery: 4000, irrigation: 2200, total: 27800 },
    { crop: 'Soybean', seeds: 4000, fertilizer: 5500, pesticide: 3500, labor: 8000, machinery: 3500, irrigation: 1500, total: 26000 },
  ];

  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [farmArea, setFarmArea] = useState("");
  const [expectedYield, setExpectedYield] = useState("");
  const [marketPrice, setMarketPrice] = useState("2000"); // default value set

  const selectedCropData = cropCostData.find(crop => crop.crop === selectedCrop) || cropCostData[0];

  const area = parseFloat(farmArea) || 0;
  const yieldValue = parseFloat(expectedYield) || 0;
  const price = parseFloat(marketPrice) || 0;

  const totalCost = selectedCropData.total * area;
  const expectedRevenue = yieldValue * price * area;
  const expectedProfit = expectedRevenue - totalCost;
  const profitMargin = expectedRevenue > 0 ? ((expectedProfit / expectedRevenue) * 100).toFixed(1) : 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Financial Calculator</Text>
      <Text style={styles.subtitle}>Crop cost, profit estimation and planning</Text>

      {/* Crop Input Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crop Details</Text>

        <Text style={styles.label}>Select Crop</Text>
        <View style={styles.row}>
          {cropCostData.map(crop => (
            <TouchableOpacity
              key={crop.crop}
              style={[
                styles.button,
                selectedCrop === crop.crop && styles.buttonSelected
              ]}
              onPress={() => setSelectedCrop(crop.crop)}
            >
              <Text style={[
                styles.buttonText,
                selectedCrop === crop.crop && { color: '#fff', fontWeight: '600' }
              ]}>{crop.crop}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Farm Area (Hectares)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={farmArea}
          onChangeText={setFarmArea}
        />

        <Text style={styles.label}>Expected Yield (Quintal/Hectare)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={expectedYield}
          onChangeText={setExpectedYield}
        />

        <Text style={styles.label}>Market Price (₹/Quintal)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={marketPrice}
          onChangeText={setMarketPrice}
        />
      </View>

      {/* Results */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Financial Analysis of {selectedCrop}</Text>
        <View style={[styles.resultBox, { backgroundColor: '#f0f8ff', borderRadius: 8, padding: 10 }]}>
          <Text style={styles.resultLabel}>Total Cost:</Text>
          <Text style={styles.resultValue}>₹{totalCost.toLocaleString('en-IN')}</Text>
        </View>
        <View style={[styles.resultBox, { backgroundColor: '#e6ffed', borderRadius: 8, padding: 10 }]}>
          <Text style={styles.resultLabel}>Expected Revenue:</Text>
          <Text style={[styles.resultValue, { color: 'green' }]}>
            ₹{expectedRevenue.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.resultBox, { backgroundColor: expectedProfit >= 0 ? '#e6ffed' : '#ffe6e6', borderRadius: 8, padding: 10 }]}>
          <Text style={styles.resultLabel}>Net Profit:</Text>
          <Text style={[styles.resultValue, { color: expectedProfit >= 0 ? 'green' : 'red' }]}>
            ₹{expectedProfit.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={[styles.resultBox, { backgroundColor: '#fff3e6', borderRadius: 8, padding: 10 }]}>
          <Text style={styles.resultLabel}>Profit Margin:</Text>
          <Text style={styles.resultValue}>{profitMargin}%</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#007bff' },
  label: { fontSize: 14, marginBottom: 6, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    elevation: 1
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8
  },
  buttonSelected: { backgroundColor: '#020d1aff', color: 'white' },
  buttonText: { color: '#000', fontWeight: '500' },
  resultBox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  resultLabel: { fontSize: 16, fontWeight: '500', color: '#333' },
  resultValue: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});
