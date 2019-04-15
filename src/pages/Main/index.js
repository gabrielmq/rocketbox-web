import React, { Component } from 'react';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
import './styles.css';

export default class Main extends Component {
  // o state contém todas as informações
  // que são manipuladas pelo component
  state = {
    newBox: ''
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await api.post('boxes', { title: this.state.newBox });
    // faz o redirecionamento para outra página
    this.props.history.push(`/box/${response.data._id}`);
  };

  handleInputChange = e => this.setState({ newBox: e.target.value });

  render() {
    return (
      <div id="main-container">
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="RocketBox Logo" />
          <input
            placeholder="Criar um Box"
            value={this.state.newBox}
            onChange={this.handleInputChange}
          />
          <button type="submit">Criar</button>
        </form>
      </div>
    );
  }
}
