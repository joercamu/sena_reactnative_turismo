import React, {Fragment} from 'react';
import {Text, TextInput, Button} from 'react-native';
export default class NewSite extends React.Component{
    url = 'http://192.168.1.4:8080/sitios';

    constructor(props){
        super(props);
        this.state = {
            name:"",
            info:"",
            photo:"",
            rate:"",
            coords:JSON.stringify({latitude:3.42158,longitude:-76.5205})
        };
        this.updateName = this.updateName.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.updatePhoto = this.updatePhoto.bind(this);
        this.updateRate = this.updateRate.bind(this);
        this.updatecoords = this.updatecoords.bind(this);

        this.createSite = this.createSite.bind(this);
    }
    updateName(value){
        this.setState({name:value});
    }
    updateInfo(value){
        this.setState({info:value});
    }
    updatePhoto(value){
        this.setState({photo:value});
    }
    updateRate(value){
        this.setState({rate:value});
    }
    updatecoords(value){
        this.setState({coords:value});
    }
    createSite(){
        console.log("insertando...");
        let myinit = {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(this.state)
        };
        fetch(this.url, myinit)
            .then((response)=>{
                return response.json();
            })
            .then((data)=>{
                console.log(data);
            })
    }
    
    render(){
        return (
            <Fragment>
                <Text>Nuevo Sitio</Text>
                <TextInput value={this.state.name} onChangeText={(e)=>this.updateName(e)}></TextInput>
                <TextInput value={this.state.info} onChangeText={(e)=>this.updateInfo(e)}></TextInput>
                <TextInput value={this.state.photo} onChangeText={(e)=>this.updatePhoto(e)}></TextInput>
                <TextInput value={this.state.rate} onChangeText={(e)=>this.updateRate(e)}></TextInput>
                <Button title="Crear Sitio" onPress={this.createSite}></Button>
            </Fragment>
        );
    }
}