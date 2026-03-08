import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '../../store/chatStore';
import { aiService } from '../../services/ai.service';
import { COLORS } from '../../constants/config';

export const AIChatScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    conversationId,
    isLoading,
    addUserMessage,
    startAssistantMessage,
    appendToken,
    setToolStatus,
    finishAssistantMessage,
    setConversationId,
    setLoading,
  } = useChatStore();

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setLoading(true);
    addUserMessage(text);
    const assistantId = startAssistantMessage();
    scrollToBottom();

    try {
      await aiService.streamChat(text, conversationId, (event) => {
        switch (event.type) {
          case 'token':
            appendToken(assistantId, event.data.content);
            scrollToBottom();
            break;
          case 'tool_call':
            setToolStatus(assistantId, `正在查询${toolNameMap[event.data.toolName] ?? '数据'}...`);
            break;
          case 'tool_result':
            setToolStatus(assistantId, '');
            break;
          case 'done':
            finishAssistantMessage(assistantId);
            if (event.data.conversationId) {
              setConversationId(event.data.conversationId);
            }
            break;
          case 'error':
            appendToken(assistantId, '抱歉，出现了一些问题，请稍后再试。');
            finishAssistantMessage(assistantId);
            break;
        }
      });
    } catch {
      appendToken(assistantId, '网络错误，请检查连接后重试。');
      finishAssistantMessage(assistantId);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.assistantRow]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          {item.toolStatus ? (
            <View style={styles.toolStatusRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.toolStatusText}>{item.toolStatus}</Text>
            </View>
          ) : null}
          {item.content ? (
            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {item.content}
            </Text>
          ) : null}
          {item.isStreaming && !item.toolStatus && (
            <Text style={styles.cursor}>▋</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI 健康伙伴</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={<EmptyState />}
        onContentSizeChange={scrollToBottom}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="问我任何健康问题..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendText}>发送</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const EmptyState: React.FC = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>🤖</Text>
    <Text style={styles.emptyTitle}>你好，我是你的 AI 健康伙伴</Text>
    <Text style={styles.emptySubtitle}>你可以问我：</Text>
    <Text style={styles.emptyHint}>• 我今天吃了多少热量？</Text>
    <Text style={styles.emptyHint}>• 帮我制定一个减脂训练计划</Text>
    <Text style={styles.emptyHint}>• 我这周运动了多少分钟？</Text>
  </View>
);

const toolNameMap: Record<string, string> = {
  get_diet_records: '饮食记录',
  get_workout_records: '运动记录',
  generate_workout_plan: '训练计划',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  messageList: { padding: 16, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  userMessageText: { color: '#fff' },
  cursor: { color: COLORS.primary, fontSize: 15 },
  toolStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  toolStatusText: { fontSize: 13, color: COLORS.textSecondary },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  sendButton: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: COLORS.border },
  sendText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 16, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8, alignSelf: 'flex-start' },
  emptyHint: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 6, alignSelf: 'flex-start' },
});
