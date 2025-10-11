import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { Moon, Sun, Wifi, WifiOff, Server, Building, ChevronDown } from 'lucide-react-native';

export default function Settings() {
  // Hardcoded state
  const [department, setDepartment] = useState("Engineering");
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const departments = [
    "General",
    "Research", 
    "Engineering",
    "Marketing",
    "Sales",
    "Support",
  ];

  // Mock handlers (no functionality)
  const handleDepartmentChange = (dept: string) => {
    console.log("Department changed to:", dept);
    setDepartment(dept);
    setShowDropdown(false);
  };

  const handleOfflineModeChange = (enabled: boolean) => {
    console.log("Offline mode:", enabled);
    setOfflineMode(enabled);
  };

  const handleThemeToggle = () => {
    console.log("Theme toggled");
    setDarkMode(!darkMode);
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="px-6 pt-16 pb-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">
            Settings
          </Text>
          <Text className="text-gray-400 text-lg">
            Manage your application preferences
          </Text>
        </View>

        {/* Department Context Card */}
        <View className="bg-gray-800 rounded-2xl p-6 mb-6">
          <View className="mb-4">
            <Text className="text-xl font-bold text-white mb-1">
              Department Context
            </Text>
            <Text className="text-gray-400 text-sm">
              Select the department to filter and organize your knowledge base
            </Text>
          </View>
          
          <View className="space-y-2">
            <Text className="text-gray-300 font-medium">Department</Text>
            
            {/* Dropdown Trigger */}
            <TouchableOpacity
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 flex-row justify-between items-center"
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text className="text-white font-medium">{department}</Text>
              <ChevronDown 
                size={20} 
                color="#9ca3af" 
                style={{ transform: [{ rotate: showDropdown ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {showDropdown && (
              <View className="bg-gray-700 border border-gray-600 rounded-lg mt-1 overflow-hidden">
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    onPress={() => handleDepartmentChange(dept)}
                    className={`px-4 py-3 border-b border-gray-600 last:border-b-0 ${
                      department === dept ? 'bg-blue-600' : 'bg-transparent'
                    }`}
                  >
                    <Text className={`font-medium ${
                      department === dept ? 'text-white' : 'text-gray-300'
                    }`}>
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Appearance Card */}
        <View className="bg-gray-800 rounded-2xl p-6 mb-6">
          <View className="mb-4">
            <Text className="text-xl font-bold text-white mb-1">
              Appearance
            </Text>
            <Text className="text-gray-400 text-sm">
              Customize how the application looks
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-300 font-medium">Theme</Text>
              <Text className="text-gray-400 text-sm">
                Switch between light and dark mode
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleThemeToggle}
              className="bg-gray-700 w-12 h-12 rounded-full items-center justify-center"
            >
              {darkMode ? (
                <Sun size={24} color="#fbbf24" />
              ) : (
                <Moon size={24} color="#6b7280" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Offline Mode Card */}
        <View className="bg-gray-800 rounded-2xl p-6 mb-6">
          <View className="mb-4">
            <Text className="text-xl font-bold text-white mb-1">
              Offline Mode
            </Text>
            <Text className="text-gray-400 text-sm">
              Work without an internet connection using cached data
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-300 font-medium">Enable Offline Mode</Text>
              <Text className="text-gray-400 text-sm">
                Use local embeddings and cached responses
              </Text>
            </View>
            <View className="flex-row items-center">
              {offlineMode ? (
                <WifiOff size={20} color="#ef4444" className="mr-3" />
              ) : (
                <Wifi size={20} color="#10b981" className="mr-3" />
              )}
              <Switch
                value={offlineMode}
                onValueChange={handleOfflineModeChange}
                trackColor={{ false: '#6b7280', true: '#10b981' }}
                thumbColor={offlineMode ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* API Configuration Card */}
        <View className="bg-gray-800 rounded-2xl p-6">
          <View className="mb-4">
            <Text className="text-xl font-bold text-white mb-1">
              API Configuration
            </Text>
            <Text className="text-gray-400 text-sm">
              Configure external API connections
            </Text>
          </View>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-300 font-medium">OpenAI API</Text>
                <Text className="text-gray-400 text-sm">
                  Status: Connected
                </Text>
              </View>
              <TouchableOpacity className="border border-gray-600 px-4 py-2 rounded-lg">
                <Text className="text-gray-300 font-medium">Configure</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-300 font-medium">Vector Database</Text>
                <Text className="text-gray-400 text-sm">
                  Status: Active
                </Text>
              </View>
              <TouchableOpacity className="border border-gray-600 px-4 py-2 rounded-lg">
                <Text className="text-gray-300 font-medium">Configure</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}