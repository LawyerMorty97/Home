import React, {Component} from "react";
import styled, {css} from "styled-components";

const Bar = styled.div`
    width: 100%;
    color: black;
    height: 48px;

    user-select: none;
    app-region: drag;
`;

const BarButton = styled.div`
    width: 32px;
    height: 32px;

    margin-top: 10px;
    margin-right: 10px;

    float: right;
    position: relative;
    app-region: no-drag;
    border-radius: 64px;

    box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.15);

    :hover {
        cursor: default;
    }
`;

const BarTitle = styled(BarButton)`
    width: auto;
    padding: 3px 0px;

    box-shadow: none;
    position: absolute;
    left: 50%;
    color: black;
    font-weight: 500;
`;

const BtnClose = styled(BarButton)`
    background: #f75f5a;

    :hover {
        background: #d3514b;
        cursor: pointer;
    }
`;

const BtnMaximize = styled(BarButton)`
    background: #33c446;

    :hover {
        background: #22ab37;
    }
`;

const BtnMinimize = styled(BarButton)`
    background: #fabc43;

    :hover {
        background: #d7a428;
    }
`;

export default class WindowBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.title
        }
    }

    render() {
        const state = this.state;

        return(
            <>
                <Bar>
                    <BarTitle>{state.title}</BarTitle>
                    <BtnClose>X</BtnClose>
                    <BtnMaximize>M</BtnMaximize>
                    <BtnMinimize>_</BtnMinimize>
                </Bar>
            </>
        );
    }
}