import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { UploadModal } from '@/components/UploadModal';
import { FileText, Image, Music, MoreVertical, Download, Trash2, Search } from 'lucide-react-native';

// Mock data type - replace with your actual File type
interface File {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  status: 'ready' | 'processing';
}

export default function Library() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'document' | 'image' | 'audio'>('all');

  // Mock data - replace with your actual data fetching
  const mockFiles: File[] = [
    { id: 1, name: 'project_document.pdf', type: 'document', size: '2.4 MB', date: 'Dec 15, 2023', status: 'ready' },
    { id: 2, name: 'vacation_photo.jpg', type: 'image', size: '1.2 MB', date: 'Dec 14, 2023', status: 'ready' },
    { id: 3, name: 'meeting_audio.mp3', type: 'audio', size: '5.7 MB', date: 'Dec 13, 2023', status: 'ready' },
    { id: 4, name: 'research_paper.docx', type: 'document', size: '3.1 MB', date: 'Dec 12, 2023', status: 'ready' },
    { id: 5, name: 'screenshot.png', type: 'image', size: '0.8 MB', date: 'Dec 11, 2023', status: 'ready' },
  ];

  // Filter files based on search and category
  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText size={24} color="#60a5fa" />;
      case 'image':
        return <Image size={24} color="#10b981" />;
      case 'audio':
        return <Music size={24} color="#f59e0b" />;
      default:
        return <FileText size={24} color="#6b7280" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'bg-blue-500';
      case 'image':
        return 'bg-green-500';
      case 'audio':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDownload = (file: File) => {
    console.log('Downloading file:', file.name);
    // Add download logic here
  };

  const handleDelete = (file: File) => {
    console.log('Deleting file:', file.name);
    // Add delete logic here
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-6 pt-6 pb-6 bg-gray-800">
        <Text className="text-3xl font-bold text-white mb-2">Resource Library</Text>
        <Text className="text-gray-400">Manage your uploaded documents, images, and audio files</Text>
      </View>

      {/* Controls */}
      <View className="px-6 py-4 border-b border-gray-700">
        <View className="flex-row justify-between items-center mb-4">
          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-800 rounded-lg px-3 py-2 flex-1 mr-3">
            <Search size={20} color="#6b7280" />
            <TextInput
              placeholder="Search files..."
              placeholderTextColor="#6b7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="text-white ml-2 flex-1"
            />
          </View>

          {/* Upload Button */}
          <TouchableOpacity
            onPress={() => setUploadOpen(true)}
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Text className="text-white font-medium">Upload</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {['all', 'document', 'image', 'audio'].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category as any)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <Text className={`font-medium ${
                selectedCategory === category ? 'text-white' : 'text-gray-300'
              }`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Files List */}
      <ScrollView className="flex-1 px-6 py-3">
        {filteredFiles.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <FileText size={64} color="#6b7280" />
            <Text className="text-gray-400 text-lg mt-4">No files found</Text>
            <Text className="text-gray-500 text-center mt-2">
              {searchQuery ? 'Try adjusting your search' : 'Upload your first file to get started'}
            </Text>
          </View>
        ) : (
          filteredFiles.map((file) => (
            <View
              key={file.id}
              className="flex-row items-center justify-between bg-gray-800 rounded-lg p-4 mb-3"
            >
              <View className="flex-row items-center flex-1">
                {getFileIcon(file.type)}
                <View className="ml-3 flex-1">
                  <Text className="text-white font-medium" numberOfLines={1}>
                    {file.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className={`w-2 h-2 rounded-full ${getFileTypeColor(file.type)} mr-2`} />
                    <Text className="text-gray-400 text-sm">
                      {file.size} • {file.date}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center">
                {file.status === 'ready' && (
                  <TouchableOpacity
                    onPress={() => handleDownload(file)}
                    className="p-2 mr-1"
                  >
                    <Download size={20} color="#60a5fa" />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  onPress={() => handleDelete(file)}
                  className="p-2"
                >
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Upload Modal */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onFilesUpload={(files) => {
          console.log('Files uploaded:', files);
          // Handle the uploaded files - you might want to refresh the list here
        }}
      />
    </View>
  );
}