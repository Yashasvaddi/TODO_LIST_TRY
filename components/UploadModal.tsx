import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { X, File, Upload } from "lucide-react-native";

interface FileItem {
  name: string;
  size?: number;
  uri: string;
  mimeType?: string;
}

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesUpload?: (files: FileItem[]) => void;
  maxFiles?: number;
}

export function UploadModal({ open, onOpenChange, onFilesUpload, maxFiles = 10 }: UploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true, // Enable multiple file selection
      });

      if (result.assets && result.assets.length > 0) {
        const newFiles = result.assets.map(asset => ({
          name: asset.name || 'Unknown File',
          size: asset.size,
          uri: asset.uri,
          mimeType: asset.mimeType,
        }));

        // Check if adding new files would exceed max limit
        if (selectedFiles.length + newFiles.length > maxFiles) {
          alert(`You can only upload up to ${maxFiles} files`);
          return;
        }

        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (err) {
      console.log("File pick error:", err);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      // Add your upload logic here
      console.log("Uploading files:", selectedFiles);
      
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onFilesUpload) {
        onFilesUpload(selectedFiles);
      }
      
      // Clear files and close modal after successful upload
      setSelectedFiles([]);
      onOpenChange(false);
    } catch (error) {
      console.log("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onOpenChange(false);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <Modal visible={open} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        <View className="bg-gray-900 w-full max-w-md rounded-2xl p-6 max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-white">Upload Files</Text>
            <Text className="text-gray-400">
              {selectedFiles.length}/{maxFiles}
            </Text>
          </View>

          {/* File List */}
          {selectedFiles.length > 0 ? (
            <ScrollView className="mb-4 max-h-48">
              {selectedFiles.map((file, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between bg-gray-800 rounded-lg p-3 mb-2"
                >
                  <View className="flex-row items-center flex-1">
                    <File size={20} color="#60a5fa" className="mr-3" />
                    <View className="flex-1">
                      <Text className="text-white font-medium" numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {formatFileSize(file.size)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFile(index)}
                    disabled={uploading}
                    className="p-1"
                  >
                    <X size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="bg-gray-800 rounded-lg p-8 items-center justify-center mb-4">
              <File size={48} color="#6b7280" className="mb-2" />
              <Text className="text-gray-400 text-center">
                No files selected
              </Text>
              <Text className="text-gray-500 text-center text-sm mt-1">
                Select up to {maxFiles} files
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="space-y-3">
            <TouchableOpacity
              onPress={pickFiles}
              disabled={uploading || selectedFiles.length >= maxFiles}
              className="bg-blue-600 py-3 px-4 rounded-lg flex-row items-center justify-center disabled:opacity-50"
            >
              <Upload size={20} color="white" className="mr-2" />
              <Text className="text-white text-center font-medium">
                {selectedFiles.length > 0 ? 'Add More Files' : 'Select Files'}
              </Text>
            </TouchableOpacity>

            {selectedFiles.length > 0 && (
              <>
                <TouchableOpacity
                  onPress={handleUpload}
                  disabled={uploading}
                  className="bg-green-600 py-3 px-4 rounded-lg flex-row items-center justify-center disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <ActivityIndicator color="white" size="small" className="mr-2" />
                      <Text className="text-white font-medium">Uploading...</Text>
                    </>
                  ) : (
                    <>
                      <Upload size={20} color="white" className="mr-2" />
                      <Text className="text-white font-medium">
                        Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={clearAllFiles}
                  disabled={uploading}
                  className="bg-gray-700 py-3 px-4 rounded-lg"
                >
                  <Text className="text-white text-center font-medium">
                    Clear All
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={handleClose}
              disabled={uploading}
              className="bg-gray-700 py-3 px-4 rounded-lg disabled:opacity-50"
            >
              <Text className="text-white text-center font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}