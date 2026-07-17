import { ActivityIndicator, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants";

// AppLoader.tsx
export const AppLoader = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;
    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }]}>
            <ActivityIndicator size="large" color={COLORS.goldPrimary} />
        </View>
    );
};