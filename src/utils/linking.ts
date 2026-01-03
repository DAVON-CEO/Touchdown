import * as Linking from 'expo-linking';
import { ContactPlatform } from '../data/models';

// Build a deep link for a given platform and value
export function buildDeepLink(platform: ContactPlatform, value: string): string {
  switch (platform) {
    case 'PHONE':
      return `tel:${value}`;
    case 'SMS':
      return `sms:${value}`;
    case 'EMAIL':
      return `mailto:${value}`;
    case 'INSTAGRAM':
      return `instagram://user?username=${value}`;
    case 'WHATSAPP':
      // Remove non-digit characters for phone numbers
      return `https://wa.me/${value.replace(/[^0-9]/g, '')}`;
    case 'TELEGRAM':
      return `https://t.me/${value}`;
    case 'LINKEDIN':
      return `https://www.linkedin.com/in/${value}`;
    case 'TIKTOK':
      return `https://www.tiktok.com/@${value}`;
    default:
      return value;
  }
}

export async function openDeepLink(url: string): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback: open as web URL if possible
      await Linking.openURL(url);
    }
  } catch (e) {
    console.warn('Failed to open link', e);
  }
}