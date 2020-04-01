import React, { Component } from "react";

import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import api from "../../services/api";
import { Form, SubmitButton, List } from "./styles";
import Container from "../../componets/Conteiner";
import { Link } from "react-router-dom";
export default class Main extends Component {
  state = {
    newRepo: "",
    respositories: [],
    loading: false
  };
  // carregar dados do localStorage
  componentDidMount() {
    const respositories = localStorage.getItem("respositories");
    if (respositories) {
      this.setState({ respositories: JSON.parse(respositories) });
    }
  }
  // salvar dados do localStorage
  componentDidUpdate(_, prevState) {
    const { respositories } = this.state;

    if (prevState.respositories !== respositories) {
      localStorage.setItem("respositories", JSON.stringify(respositories));
    }
  }
  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };
  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    const { newRepo, respositories } = this.state;
    console.log(newRepo);
    const response = await api.get(`repos/${newRepo.replace(" ", "")}`);
    const data = {
      name: response.data.full_name
    };
    this.setState({
      respositories: [...respositories, data],
      newRepo: "",
      loading: false
    });
  };
  render() {
    const { newRepo, respositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositorios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositorio"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {respositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
