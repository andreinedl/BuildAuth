import { MotiView } from "moti"
import SkeletonExpo from "moti/build/skeleton/expo"
import { Surface } from "react-native-paper"

export default function LoadingCard() {
    return (
        <MotiView style={{marginTop: 25, width: "100%", height: "23%", justifyContent: "center", alignItems: "center", alignContent: "center", backgroundColor: "none"}} transition={{
            type: 'spring',
          }}>               
                <Surface elevation={5} style={{width: "80%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                    <SkeletonExpo show={true} transition={{ type: 'spring', duration: 2000 }} width={"100%"}  height={"100%"} colorMode='dark'>
                    </SkeletonExpo>
                </Surface>
        </MotiView>
    )
}