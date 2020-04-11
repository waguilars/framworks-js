import React, { Component } from 'react'
import './MensajeEstatico'
import MensajeEstatico from './MensajeEstatico'

class Peliculas extends Component {

    render() {
        return (
            <React.Fragment>
                <h4>Sou el componente de Peliculas</h4>
                <MensajeEstatico></MensajeEstatico>
            </React.Fragment>
        )
    }
}

export default Peliculas;