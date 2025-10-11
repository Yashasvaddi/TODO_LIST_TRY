import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { 
  Files, 
  Clock, 
  Database, 
  RefreshCw, 
  BarChart3,
  Activity,
  CheckCircle,
  PlayCircle
} from 'lucide-react-native';

export default function Dashboard() {
  // Hardcoded stats data
  const stats = {
    totalFiles: 24,
    lastIndexed: "2 hours ago",
    embeddingStatus: "active" as const,
    department: "Engineering",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": 
        return "bg-green-500";
      case "processing": 
        return "bg-yellow-500";
      default: 
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Activity size={16} color="#10b981" />;
      case "processing":
        return <RefreshCw size={16} color="#f59e0b" />;
      case "idle":
      default:
        return <CheckCircle size={16} color="#6b7280" />;
    }
  };

  // Mock handlers (no functionality)
  const handleViewFiles = () => {
    console.log("View files clicked");
  };

  const handleRebuildIndex = () => {
    console.log("Rebuild index clicked");
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="px-6 pt-8 pb-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white mb-2">
            Department Dashboard
          </Text>
          <Text className="text-gray-400 text-lg">
            Overview of your {stats.department} knowledge base
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap -mx-2 mb-6">
          {/* Total Files Card */}
          <View className="w-full md:w-1/3 px-2 mb-4">
            <View className="bg-gray-800 rounded-2xl p-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-400 text-sm font-medium">
                  Total Files
                </Text>
                <Files size={20} color="#9ca3af" />
              </View>
              <Text className="text-4xl font-bold text-white mb-1">
                {stats.totalFiles}
              </Text>
              <Text className="text-gray-400 text-xs">
                Documents indexed
              </Text>
            </View>
          </View>

          {/* Last Indexed Card */}
          <View className="w-full md:w-1/3 px-2 mb-4">
            <View className="bg-gray-800 rounded-2xl p-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-400 text-sm font-medium">
                  Last Indexed
                </Text>
                <Clock size={20} color="#9ca3af" />
              </View>
              <Text className="text-2xl font-bold text-white mb-1">
                {stats.lastIndexed}
              </Text>
              <Text className="text-gray-400 text-xs">
                Knowledge base updated
              </Text>
            </View>
          </View>

          {/* Embedding Status Card */}
          <View className="w-full md:w-1/3 px-2 mb-4">
            <View className="bg-gray-800 rounded-2xl p-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-400 text-sm font-medium">
                  Embedding Status
                </Text>
                <Database size={20} color="#9ca3af" />
              </View>
              <View className="flex-row items-center mb-1">
                <View className={`w-2 h-2 rounded-full ${getStatusColor(stats.embeddingStatus)} mr-2`} />
                <Text className="text-white font-bold text-lg capitalize">
                  {stats.embeddingStatus}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs">
                Vector database status
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Card */}
        <View className="bg-gray-800 rounded-2xl p-6 mb-6">
          <Text className="text-xl font-bold text-white mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap">
            <TouchableOpacity
              onPress={handleViewFiles}
              className="bg-blue-600 px-4 py-3 rounded-lg flex-row items-center mr-3 mb-3"
            >
              <Files size={20} color="white" className="mr-2" />
              <Text className="text-white font-medium">View All Files</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRebuildIndex}
              className="border border-gray-600 px-4 py-3 rounded-lg flex-row items-center mr-3 mb-3"
            >
              <RefreshCw size={20} color="#d1d5db" className="mr-2" />
              <Text className="text-gray-300 font-medium">Rebuild Index</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Card */}
        <View className="bg-gray-800 rounded-2xl p-6">
          <Text className="text-xl font-bold text-white mb-4">
            Recent Activity
          </Text>
          
          {stats.totalFiles === 0 ? (
            <Text className="text-gray-400 text-sm">
              No activity yet. Upload files to get started.
            </Text>
          ) : (
            <View className="space-y-4">
              {/* Activity Item 1 */}
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                <View className="flex-1">
                  <Text className="text-white font-medium text-sm">
                    Files indexed successfully
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    {stats.lastIndexed}
                  </Text>
                </View>
              </View>

              {/* Activity Item 2 */}
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-3" />
                <View className="flex-1">
                  <Text className="text-white font-medium text-sm">
                    Embeddings generated
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    Vector database updated
                  </Text>
                </View>
              </View>

              {/* Activity Item 3 */}
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-purple-500 mr-3" />
                <View className="flex-1">
                  <Text className="text-white font-medium text-sm">
                    New files uploaded
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    3 documents added to library
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}