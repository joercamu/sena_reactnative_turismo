import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import ExpandPerimeter from './components/expandPerimeter';

const url = "http://especializacionsena.appspot.com";

export default class PlacesNear extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gettingPosition: false,
            longitude: -72,
            latitude: 4,
            latitudeDelta: 10,
            longitudeDelta: 10,
            data: [],
            PerimetreNear: 2000,
            coords:{}
        }
    }
    // function getDistance(p1, p2) {
    //     rad = x => x * Math.PI / 180;
    //     var R = 6378137; //radio de la tierra en metros
    //     var dLat = rad(p2.latitude - p1.latitude);
    //     var dLong = rad(p2.longitude - p1.longitude);
    //     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     var d = R * c;
    //     return d;
    //   }
    getDelta(latitudCentro, longitudeCentro, latitudNoreste, latitudSureste) {
        const { width, height } = Dimensions.get('window');
        const ASPECT_RATIO = width / height;

        const lat = parseFloat(latitudCentro);
        const lng = parseFloat(longitudeCentro);
        const northeastLat = parseFloat(latitudNoreste);
        const southwestLat = parseFloat(latitudSureste);
        const latDelta = northeastLat - southwestLat;
        const lngDelta = latDelta * ASPECT_RATIO;

        return { "latDelta": latDelta, "lngDelta": lngDelta };
    }
    getLatNortheastSouthwest(lat, long) {
        var delta = {};
        fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyBRTNdWi2Vx2VPRkLFMDgmQYQACOT1urnE")
            .then((response) => response.json())
            .then((responseJson) => {
                delta.northeast = responseJson.results[0].geometry.viewport.northeast.lat
                delta.southwest = responseJson.results[0].geometry.viewport.southwest.lat
                return delta;
            })
            .catch((error) => {
                console.error(error);
                console.log(error);
            });
    }
    async getSitesNear(coords) {
        console.log('consultando sitios...');
        const response = await fetch(url + '/sitios');
        const dataSites = await response.json();
        let siteNear = dataSites.info.filter(site => {
            // alert(this.state.PerimetreNear);
            site.coords = JSON.parse(site.coords);
            return this.getDistance(site.coords, coords) < this.state.PerimetreNear;
        });
        // alert(JSON.stringify(siteNear));
        this.setState({ data: siteNear });

    }
    getDistance(p1, p2) {
        try {
            rad = x => x * Math.PI / 180;
            var R = 6378137; //radio de la tierra en metros
            var dLat = rad(p2.latitude - p1.latitude);
            var dLong = rad(p2.longitude - p1.longitude);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        } catch (e) {
            return ''.e;
        }

    }


    // latitudeDelta: 0.0922,
    //                     longitudeDelta: 0.0421
    render() {
        return (
            <View
                style={styles.container}>
                <View style={styles.container_text}>
                    <Text style={styles.text_header}>Encontrar sitios en el Maps</Text>
                </View>
                <View style={styles.container_text}>
                    <ExpandPerimeter
                        style={styles.text_header}
                        valuePerimetreNear={this.state.PerimetreNear}
                        decrease={() => {
                            this.setState(prevState => {
                                return { PerimetreNear: prevState.PerimetreNear - 500 }
                            }, () => { this.getSitesNear(this.state.coords) })
                        }}
                        increase={() => {
                            this.setState(prevState => {
                                return { PerimetreNear: prevState.PerimetreNear + 500 }
                            }, () => { this.getSitesNear(this.state.coords) })
                        }}
                    />
                </View>
                <MapView
                    style={styles.map}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta
                    }}
                    onPress={(e => {
                        console.log(e.nativeEvent);
                    })}
                >
                    <Circle
                        center={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                        radius={this.state.PerimetreNear}
                    >
                    </Circle>
                    <Marker
                        title="Marcador"
                        coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                        image="http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png">
                    </Marker>
                    {this.state.data.map(marker => (
                        <Marker
                            key={marker.id}
                            title={marker.name}
                            coordinate={marker.coords}
                            description={marker.info}
                        />
                    ))}
                </MapView>
                <TouchableOpacity
                    disabled={this.state.gettingPosition}
                    style={styles.button_findme}
                    onPress={() => {
                        // console.log(this.state.data);
                        this.setState({ gettingPosition: true })
                        console.log('ubicando....');
                        Geolocation.getCurrentPosition(
                            (info) => {
                                console.log('ubicado en ' + JSON.stringify(info.coords));
                                this.setState({ gettingPosition: false });

                                fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + info.coords.latitude + "," + info.coords.longitude + "&key=AIzaSyBRTNdWi2Vx2VPRkLFMDgmQYQACOT1urnE")
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        //alert(responseJson.results[0].geometry.viewport.northeast.lat);
                                        var delta = this.getDelta(info.coords.latitude, info.coords.longitude, responseJson.results[0].geometry.viewport.northeast.lat, responseJson.results[0].geometry.viewport.southwest.lat)
                                        // alert(delta.latDelta);
                                        this.setState({ latitude: info.coords.latitude });
                                        this.setState({ longitude: info.coords.longitude })
                                        this.setState({ latitudeDelta: delta.latDelta });
                                        this.setState({ longitudeDelta: delta.lngDelta })
                                        //get sites near
                                        this.setState({ coords: info.coords });
                                        this.getSitesNear(info.coords);

                                    })
                                    .catch((error) => {
                                        this.setState({ gettingPosition: false });
                                        console.error(error);
                                        console.log(error);
                                    });


                            },
                            (error) => {
                                alert("Code:" + error.code + ", " + error.message);
                            },
                            { enableHighAccuracy: true, timeout: 15000 }
                        );
                    }}
                >
                    <Text style={styles.text_header}>Encontrar cerca a mi ubicacion</Text>


                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#065fd4'
    },
    map: {
        width: '100%',
        flex: 10
    },
    button_findme: {
        flex: 1,
        height: '100%',
        justifyContent: 'center'

    },
    container_text: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_header: {
        color: '#fff',
        fontSize: 22
    }

});