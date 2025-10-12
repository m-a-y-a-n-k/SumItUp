import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    switch (variant) {
      case 'outline':
        return [...baseStyle, styles.outlineText];
      default:
        return [...baseStyle, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#007AFF' : '#FFFFFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#6C757D',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#007AFF',
  },
});

export default Button;
