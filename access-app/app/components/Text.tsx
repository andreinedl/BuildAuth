import { Text as RNPText } from 'react-native-paper'
import styled from 'styled-components/native';
import {View} from 'react-native';

const Text = styled(RNPText)<{ textVariant: string }>`
    font-family: Raleway-${props => props.textVariant.charAt(0).toUpperCase() + props.textVariant.slice(1)};
`

export default Text

