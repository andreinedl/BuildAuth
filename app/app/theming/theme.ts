import { MD3DarkTheme, useTheme, configureFonts } from 'react-native-paper';
import { Raleway_400Regular, Raleway_700Bold, Raleway_700Bold_Italic, Raleway_400Regular_Italic } from '@expo-google-fonts/raleway';

const baseFont = {
    fontFamily: 'Raleway-Regular',
  } as const;

const baseVariants = configureFonts({ config: baseFont });

const customVariants = {
    // Customize individual base variants:
    displayMedium: {
      ...baseVariants.displayMedium,
      fontFamily: 'Raleway-Bold',
    },

    // Add own tokens if required:
    bold: {
      ...baseVariants.bodyMedium,
      fontFamily: 'Raleway-Bold',
    },
    italic: {
      ...baseVariants.bodyMedium,
      fontFamily: 'Raleway-Italic',
    },
    boldItalic: {
      ...baseVariants.bodyMedium,
      fontFamily: 'Raleway-BoldItalic',
    },
  } as const;

const fonts = configureFonts({
  config: {
    ...baseVariants,
    ...customVariants,
  },
});

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Customize colors - colours generated with ChatGPT :D
    primary: '#8B0000',   
    onPrimary: '#FFFFFF', 
    secondary: '#FF6347', 
    onSecondary: '#000000',
    background: '#121212',
    onSurface: '#E0E0E0', 
    error: '#CF6679',     
    onError: '#FFFFFF',   
    outline: '#373737',   
  },
  fonts: fonts,
  roundness: 12
}

export default theme