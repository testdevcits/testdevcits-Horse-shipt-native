// EmptyState.tsx
import { View } from "react-native";
import { COLORS, FONTS } from "../../constants";
import AppText from "./AppText";
export const EmptyState = ({ title, message, icon: Icon }: any) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <Icon size={60} color={COLORS.lightGrey} strokeWidth={1} />
        <AppText style={{ fontFamily: FONTS.bold, fontSize: 18, marginTop: 16 }}>{title}</AppText>
        <AppText style={{ textAlign: 'center', color: COLORS.textSecondary, marginTop: 8 }}>{message}</AppText>
    </View>
);