// import * as React from 'react';
// import { Button } from 'react-native-paper';
// import {View, StyleSheet} from "react-native";
// import {useState} from "react";
//
// const ButtonFoto = () => {
//     const [showCamera, setShowCamera] = useState(false);
//
//     const handleTakePhoto = () => {
//         setShowCamera(true);
//     };
//
//     return (
//         <View style={styles.buttonContainer}>
//             {showCamera ? (
//                 <CameraUse/>
//             ) : (
//                 <Button
//                     icon="camera"
//                     mode="contained"
//                     onPress={handleTakePhoto}
//                     style={styles.buttonStyle}
//                 >
//                     Take a photo
//                 </Button>
//             )}
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     buttonContainer: {
//         flex: 1,
//         justifyContent: "flex-start",
//         alignItems: "center",
//
//     },
//     buttonStyle: {
//
//     },
// });
//
// export default ButtonFoto;
