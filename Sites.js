import React, {Fragment} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default class Sites extends React.Component {
    url = 'http://especializacionsena.appspot.com/sitios';

    constructor(props){
        super(props);
        
        this.state = {
            sities : []
        }
        this.getSities();
    }
    getSities(){
        console.log("consultando...");
        fetch(this.url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.setState({sities: data.info});
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    render(){
        return(
            <View>
                <Text>Sitios...</Text>
            </View>
        )
    }
}