// app/chatbot/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatBotScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  // Keyboard animation
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, text.trim()]);
    setText('');
    Keyboard.dismiss();
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Image Upload</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{item}</Text>
          </View>
        )}
        //contentContainerStyle={{ padding: 10, flexGrow: 1 }}
        contentContainerStyle={{ padding: 10, flexGrow: 1, paddingBottom: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <Animated.View style={[
        styles.inputWrapper, 
        { marginBottom: Animated.add(keyboardHeight, new Animated.Value(20)) }
        //{ marginBottom: keyboardHeight }

        ]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
        />
        {text.trim() === '' ? (
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Top bar
  topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  topBarTitle: { fontSize: 18, fontWeight: 'bold' },

  // Messages
  messageBox: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  messageText: { 
    fontSize: 16,
    marginLeft: 1
  },

  // Input
  inputWrapper: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 5,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
  },
  micButton: {
    marginLeft: 5,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
  },
});
