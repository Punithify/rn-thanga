import React from 'react'
import{ view,ImageBackground} from 'react-native';

const Background=({children}) => {
    return (
        <View>
            <ImageBackground source={require("./assets/job.jpg")} 
            style={{height:'100%'}}/>
           <View style={{position: "absolute"}}>
            children
           </View>

        
        </View>
    );
}