import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SingleGradientDot = () => {
  const [selected, setSelected] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setSelected(!selected)}
        style={styles.dotContainer}
      >
        {selected && (
          <LinearGradient
            colors={['#47C0D2', '#1B2351']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientDot}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SingleGradientDot;

const styles = StyleSheet.create({
  dotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1B2351',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
