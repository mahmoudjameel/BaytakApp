import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Keep a neutral root container. Direction is handled explicitly per component
 * using the app language helpers to avoid double-mirroring issues.
 */
export const DirectionalRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={styles.root}>{children}</View>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
