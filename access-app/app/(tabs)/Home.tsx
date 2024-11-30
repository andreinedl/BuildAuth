import { View } from 'react-native'
import { Surface, Icon } from 'react-native-paper'
import { theme } from '../theming/theme'

//Import components
import Header from '../components/HomeComponents/HomeHeader'
import AccessCard from '../components/HomeComponents/AccessCard'
import AccessLogs from '../components/HomeComponents/AccessLogs'

export default function Home() {
    return (
        <View style={{ backgroundColor: theme.colors.background, height: "100%", width: "100%", flex: 1, justifyContent: "center" }}>
            <Surface elevation={4} style={{
                backgroundColor: theme.colors.surface,
                width: "95%",
                height: "97%", 
                alignSelf: 'center',
                borderRadius: 20,
            }}>
                <Header />
                <AccessCard />
                <AccessLogs />
            </Surface>
        </View>
    )
}