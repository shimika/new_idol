import React, { Component } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import searchIdolName from '../../mapping';

class IdolSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idolData: [],
            imgData: [],
            inputValue: "",
            loadingDisplay: 'none'
        }
    }

    async componentDidMount() {
        const idolData = await axios.get('http://localhost:3002/idolData');
        this.setState({ idolData: idolData.data.content });
    }

    onChange = (val) => {
        this.setState({ inputValue: val.target.value })
    }

    onClick = async () => {
        const { inputValue, idolData } = this.state;
        const name = searchIdolName(inputValue);
        const idolInfo = name && idolData.filter(a => a.name === name);
        const { classification } = idolInfo[0];

        let classColor = this.getClassColor(classification);


        const id = idolInfo ? idolInfo[0].idolId : false;

        if (!id) {
            this.setState({ imgData: [] });
            return;
        }

        this.setState({ imgData: [], loadingDisplay: 'block' });

        const cardSearchResult = await axios.get(`http://localhost:3002/idolCardList?id=${id}`);
        if (cardSearchResult) {
            const imgArr = cardSearchResult.data.content.map(a => {
                return (
                    <li className="item-content">
                        <div >
                            <img src={`https://imas.gamedbs.jp/cg/image_sp/card/xs/${a.cardHash}.jpg`} />
                            <div style={{ color: classColor }}>
                                카드명:{a.name}
                            </div>
                        </div>
                    </li>
                )
            })
            this.setState({ imgData: imgArr, loadingDisplay: 'none' })
        }
    }

    getClassColor = (val) => {
        switch (val) {
            case "Cute":
                return "#ff50ff";
            case "Cool":
                return "081cd1";
            case "Passion":
                return "#d38219";
            default:
                return "080808";
        }
    }

    render() {
        const { imgData, loadingDisplay } = this.state;
        const { title } = this.props;
        return (
            <Layout>
                {title}
                <div>
                    검색:<input onChange={this.onChange}></input><button onClick={this.onClick}>확인</button>
                </div>
                <div className="progress" style={{ display: loadingDisplay }}>
                    <div className="outer">
                        <div className="inner"></div>
                    </div>
                </div>
                <ul className="item-body">
                    {imgData}
                </ul>
            </Layout >
        )
    }
}

IdolSearch.getInitialProps = ({ query }) => {
    return query;
}

export default IdolSearch;