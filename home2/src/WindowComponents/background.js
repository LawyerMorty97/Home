import React, {Component} from "react";
import styled, {css} from "styled-components";

const GradientBlue = styled.div`
    background: linear-gradient(to bottom, #045ff8, #6ecfd5);
`;

const GradientHarvey = styled.div`
    background: linear-gradient(to bottom, #1f4037, #99f2c8);
`;

const GradientPurple = styled.div`
    background: linear-gradient(to bottom, #8e2de2, #4a00e0);
`;

const GradientRed = styled.div`
    background: linear-gradient(to bottom, #c31432, #240b36);
`;

const GradientDream = styled.div`
    background: linear-gradient(to bottom, #34e89e, #0f3443);
`;

const BackgroundGradient = styled.div`
    width: 100vw;
    height: 100vh;

    ${props => props.color === "blue" && css`
        background: linear-gradient(to bottom, #045ff8, #6ecfd5);
    `}
    ${props => props.color === "harvey" && css`
        background: linear-gradient(to bottom, #1f4037, #99f2c8);
    `}
    ${props => props.color === "purple" && css`
        background: linear-gradient(to bottom, #8e2de2, #4a00e0);
    `}
    ${props => props.color === "red" && css`
        background: linear-gradient(to bottom, #c31432, #240b36);
    `}
    ${props => props.color === "dream" && css`
        background: linear-gradient(to bottom, #34e89e, #0f3443);
    `}
`;

export default class Background extends Component {
    constructor(props) {
        super(props);

        this.state = {
            color: props.color ? props.color : "blue"
        }
    }

    render() {
        const state = this.state;
        const color = state.color;

        const style = {"width": "100vw", "height": "100vh"};

        return(
            <>
                <BackgroundGradient color={color}>
                    {this.props.children}
                </BackgroundGradient>
            </>
        );
    }
}