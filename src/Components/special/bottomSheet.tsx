import React from 'react';
import { View, Button, Text, Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function BottomSheet({ children, refRBSheet }: { children?: React.ReactNode, refRBSheet: React.RefObject<any> }) {
    
    return (
        <View style={{ flex: 1 }}>
            <RBSheet
                ref={refRBSheet}
                useNativeDriver={false}
                draggable={true}
                dragOnContent={false}
                height={SCREEN_HEIGHT * 0.8}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0, 0, 0, 0.24)',
                    },
                    draggableIcon: {
                        backgroundColor: '#CDCFD0',
                        width: 40,
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: 'white',
                    }
                }}
                customModalProps={{
                    animationType: 'none',
                    statusBarTranslucent: true,
                }}
            >
                <View style={{ paddingBottom: 40, paddingTop: 10 }}>
                    {children ? children : <View style={{ padding: 20 }}><Text>BottomSheet Content</Text></View>}
                </View>
            </RBSheet>
        </View>
    );
}