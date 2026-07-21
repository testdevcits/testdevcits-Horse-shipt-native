import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { ChevronLeft, Send, Paperclip, Image as ImageIcon, MapPin } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './style.chatdetail';
import { COLORS } from '../../../../constants';
import useChatDetails from './useChatDetails';
import { AppText } from '../../../../components';

const ChatDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { shipmentId }: any = route.params;
    const [inputText, setInputText] = useState('');

    const { messages, loading, shipment, currentUser, sendMessage } = useChatDetails(shipmentId);

    const handleSend = () => {
        if (inputText.trim()) {
            sendMessage(inputText);
            setInputText('');
        }
    };

    const renderMessage = ({ item }: any) => {
        const isMe = item.senderRole === 'customer';
        const hasMedia = item.media && item.media.length > 0;

        return (
            <View style={[styles.bubbleWrapper, isMe ? styles.myBubbleWrapper : styles.otherBubbleWrapper]}>
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                    {hasMedia && (
                        <Image source={{ uri: item.media[0].url }} style={styles.mediaImage} resizeMode="cover" />
                    )}
                    {item.message ? (
                        <AppText style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                            {item.message}
                        </AppText>
                    ) : null}
                    <AppText style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </AppText>
                </View>
            </View>
        );
    };

    if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={COLORS.goldPrimary} /></View>;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft color={COLORS.textPrimary} /></TouchableOpacity>
                <View style={styles.headerInfo}>
                    <AppText style={styles.headerName}>{shipment?.shipmentCode}</AppText>
                    <AppText style={styles.headerSub}>Live Shipment Chat</AppText>
                </View>
                <TouchableOpacity><MapPin size={20} color={COLORS.goldPrimary} /></TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                keyExtractor={item => item._id}
                renderItem={renderMessage}
                inverted
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Input Area */}
            <View style={styles.inputWrapper}>
                <TouchableOpacity><ImageIcon size={24} color={COLORS.grey400} /></TouchableOpacity>
                <TextInput
                    placeholder="Type a message..."
                    style={styles.inputField}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Send size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatDetails;