import React from 'react';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { StyleProp, TextStyle } from 'react-native';

export type IconName =
  | 'home'
  | 'home-outline'
  | 'products'
  | 'products-outline'
  | 'orders'
  | 'orders-outline'
  | 'profile'
  | 'profile-outline'
  | 'cart'
  | 'cart-outline'
  | 'search'
  | 'close'
  | 'check'
  | 'check-circle'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'refresh'
  | 'filter'
  | 'tag'
  | 'truck'
  | 'shield-check'
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'building'
  | 'qr-code'
  | 'barcode'
  | 'cash'
  | 'info'
  | 'alert-circle'
  | 'star'
  | 'clock'
  | 'log-out'
  | 'edit'
  | 'layers'
  | 'sparkles'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'package'
  | 'trending-up'
  | 'analytics'
  | 'clipboard'
  | 'call'
  | 'camera'
  | 'camera-outline'
  | 'image'
  | 'alert-triangle'
  | 'message-square';


interface IconProps {
  name: IconName;
  size?: number;
  color?: any;
  style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = '#0F172A',
  style,
}) => {
  switch (name) {
    case 'eye':
      return <Ionicons name="eye-outline" size={size} color={color} style={style} />;
    case 'eye-off':
      return <Ionicons name="eye-off-outline" size={size} color={color} style={style} />;
    case 'home':
      return <Ionicons name="home" size={size} color={color} style={style} />;
    case 'home-outline':
      return <Ionicons name="home-outline" size={size} color={color} style={style} />;
    case 'products':
      return <Ionicons name="grid" size={size} color={color} style={style} />;
    case 'products-outline':
      return <Ionicons name="grid-outline" size={size} color={color} style={style} />;
    case 'orders':
      return <Ionicons name="receipt" size={size} color={color} style={style} />;
    case 'orders-outline':
      return <Ionicons name="receipt-outline" size={size} color={color} style={style} />;
    case 'profile':
      return <Ionicons name="person" size={size} color={color} style={style} />;
    case 'profile-outline':
      return <Ionicons name="person-outline" size={size} color={color} style={style} />;
    case 'cart':
      return <Ionicons name="cart" size={size} color={color} style={style} />;
    case 'cart-outline':
      return <Ionicons name="cart-outline" size={size} color={color} style={style} />;
    case 'search':
      return <Ionicons name="search-outline" size={size} color={color} style={style} />;
    case 'close':
      return <Ionicons name="close" size={size} color={color} style={style} />;
    case 'check':
      return <Ionicons name="checkmark" size={size} color={color} style={style} />;
    case 'check-circle':
      return <Ionicons name="checkmark-circle" size={size} color={color} style={style} />;
    case 'arrow-left':
      return <Ionicons name="arrow-back" size={size} color={color} style={style} />;
    case 'arrow-right':
      return <Ionicons name="arrow-forward" size={size} color={color} style={style} />;
    case 'chevron-right':
      return <Ionicons name="chevron-forward" size={size} color={color} style={style} />;
    case 'chevron-down':
      return <Ionicons name="chevron-down" size={size} color={color} style={style} />;
    case 'chevron-up':
      return <Ionicons name="chevron-up" size={size} color={color} style={style} />;
    case 'plus':
      return <Ionicons name="add" size={size} color={color} style={style} />;
    case 'minus':
      return <Ionicons name="remove" size={size} color={color} style={style} />;
    case 'trash':
      return <Ionicons name="trash-outline" size={size} color={color} style={style} />;
    case 'refresh':
      return <Ionicons name="refresh" size={size} color={color} style={style} />;
    case 'filter':
      return <Ionicons name="funnel-outline" size={size} color={color} style={style} />;
    case 'tag':
      return <Ionicons name="pricetag-outline" size={size} color={color} style={style} />;
    case 'truck':
      return <MaterialCommunityIcons name="truck-delivery-outline" size={size} color={color} style={style} />;
    case 'shield-check':
      return <MaterialCommunityIcons name="shield-check" size={size} color={color} style={style} />;
    case 'phone':
      return <Ionicons name="call-outline" size={size} color={color} style={style} />;
    case 'mail':
      return <Ionicons name="mail-outline" size={size} color={color} style={style} />;
    case 'map-pin':
      return <Ionicons name="location-outline" size={size} color={color} style={style} />;
    case 'building':
      return <MaterialCommunityIcons name="factory" size={size} color={color} style={style} />;
    case 'qr-code':
      return <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} style={style} />;
    case 'barcode':
      return <MaterialCommunityIcons name="barcode-scan" size={size} color={color} style={style} />;
    case 'cash':
      return <MaterialCommunityIcons name="cash-multiple" size={size} color={color} style={style} />;
    case 'info':
      return <Ionicons name="information-circle-outline" size={size} color={color} style={style} />;
    case 'alert-circle':
      return <Ionicons name="alert-circle" size={size} color={color} style={style} />;
    case 'star':
      return <Ionicons name="star" size={size} color={color} style={style} />;
    case 'clock':
      return <Ionicons name="time-outline" size={size} color={color} style={style} />;
    case 'log-out':
      return <Ionicons name="log-out-outline" size={size} color={color} style={style} />;
    case 'edit':
      return <Ionicons name="create-outline" size={size} color={color} style={style} />;
    case 'layers':
      return <Ionicons name="layers-outline" size={size} color={color} style={style} />;
    case 'sparkles':
      return <Ionicons name="sparkles" size={size} color={color} style={style} />;
    case 'lock':
      return <Ionicons name="lock-closed-outline" size={size} color={color} style={style} />;
    case 'package':
      return <Feather name="package" size={size} color={color} style={style} />;
    case 'trending-up':
      return <Ionicons name="trending-up-outline" size={size} color={color} style={style} />;
    case 'analytics':
      return <Ionicons name="stats-chart-outline" size={size} color={color} style={style} />;
    case 'clipboard':
      return <Ionicons name="clipboard-outline" size={size} color={color} style={style} />;
    case 'call':
      return <Ionicons name="call-outline" size={size} color={color} style={style} />;
    case 'camera':
      return <Ionicons name="camera" size={size} color={color} style={style} />;
    case 'camera-outline':
      return <Ionicons name="camera-outline" size={size} color={color} style={style} />;
    case 'image':
      return <Ionicons name="image-outline" size={size} color={color} style={style} />;
    case 'alert-triangle':
      return <Feather name="alert-triangle" size={size} color={color} style={style} />;
    case 'message-square':
      return <Feather name="message-square" size={size} color={color} style={style} />;
    default:
      return <Feather name="circle" size={size} color={color} style={style} />;
  }
};
