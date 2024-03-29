import React, { Component } from 'react'
import Sidebar from './Sidebar'
import { Global } from "../global";
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import ReacTValidator from "simple-react-validator";
import swal from "sweetalert";
import defaultImgae from '../assets/images/default-image.jpg'

export default class EditArticle extends Component {

    titleRef = React.createRef();
    contentRef = React.createRef();
    uri = Global.url

    articleID = null

    state = {
        article: {},
        status: null,
        selectedFile: null
    }

    changeState = () => {
        this.setState({
            article: {
                title: this.titleRef.current.value,
                content: this.contentRef.current.value,
                image: this.state.article.image
            }
        })
        // console.log(this.state);
        this.validator.showMessages();
        this.forceUpdate();
    }

    saveArticle = (e) => {
        e.preventDefault();
        this.changeState()

        if (!this.validator.allValid()) {
            this.setState({
                status: 'error'
            })
            this.validator.showMessages()
            this.forceUpdate()
            return
        }

        // peticion post a la api
        Axios.put(this.uri + '/article/' + this.articleID, this.state.article)
            .then(res => {
                if (res.data.article) {
                    this.setState({
                        article: res.data.article,
                        status: 'waiting'
                    })

                    swal(
                        'Articulo creado',
                        'El articulo ha sido creado correctamente',
                        'success'
                    );

                    // Subir imagen
                    if (this.state.selectedFile) {
                        // sacar id del articulo guardado
                        let articleID = this.state.article._id;

                        // crear form data y añadir file
                        const formData = new FormData();
                        formData.append(
                            'file0',
                            this.state.selectedFile,
                            this.state.selectedFile.name
                        )

                        //peticion
                        Axios.post(this.uri + '/upload-image/' + articleID, formData)
                            .then(res => {
                                if (res.data.article) {
                                    this.setState({
                                        article: res.data.article,
                                        status: 'ok'
                                    })
                                } else {
                                    this.setState({
                                        article: res.data.article,
                                        status: 'error'
                                    })
                                }
                            })

                    } else {
                        this.setState({
                            status: 'ok'
                        })
                    }

                } else {
                    this.setState({
                        status: 'error'
                    })
                }
            })
            .catch(err => console.log(err))
    }

    componentWillMount() {
        this.articleID = this.props.match.params.id
        this.getArticle(this.articleID)
        this.validator = new ReacTValidator({
            messages: {
                required: 'Este campo es obligatorio'
            }
        });
    }

    getArticle = id => {
        Axios.get(this.uri + '/article/' + id)
            .then(res => {
                this.setState({
                    article: res.data.article
                })
            })
    }

    fileChange = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        })
        console.log(this.state);
    }


    render() {
        // console.log(this.state.article);
        if (this.state.status === 'ok') {
            return <Redirect to="/blog"></Redirect>
        }

        let article = this.state.article
        return (
            <div className="center">
                <section className="content">
                    <h1 className="subheader">
                        Editar Articulo
                    </h1>
                    {article &&
                        <form className="mid-form" onSubmit={this.saveArticle}>
                            <div className="form-group">
                                <label htmlFor="title">Titulo</label>
                                <input
                                    type="text"
                                    name="title"
                                    defaultValue={article.title}
                                    ref={this.titleRef}
                                    onChange={this.changeState} />
                                {
                                    this.validator.message(
                                        'title',
                                        this.state.article.title,
                                        'required|alpha_num_space')

                                }
                            </div>

                            <div className="form-group">
                                <label htmlFor="Content">Contenido</label>
                                <textarea
                                    type="text"
                                    name="content"
                                    defaultValue={article.content}
                                    ref={this.contentRef}
                                    onChange={this.changeState} />
                                {
                                    this.validator.message(
                                        'content',
                                        this.state.article.content,
                                        'required')

                                }
                            </div>

                            <div className="form-group">
                                <label htmlFor="file0">Imagen: </label>
                                <input type="file" name="file0" onChange={this.fileChange} />
                                <div className="image-wrap">
                                    {
                                        article.image ?
                                            (
                                                <img
                                                    src={this.uri + '/image/' + article.image}
                                                    alt={article.title} />
                                            ) : (
                                                <img
                                                    src={defaultImgae}
                                                    alt={article.title} />

                                            )
                                    }
                                </div>
                            </div>
                            <input type="submit" value="Guardar" className="btn btn-success" />

                        </form>
                    }


                </section>
                <Sidebar></Sidebar>
            </div>
        )
    }
}
