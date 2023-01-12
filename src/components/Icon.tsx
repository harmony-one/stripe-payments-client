import { Box } from "grommet";
import React from "react";
import styled from "styled-components";
import { ReactComponent as HarmonyImg } from '../assets/icons/harmony_logo.svg'
import Img1 from '../assets/images/image1.jpeg'
import Img2 from '../assets/images/image2.jpeg'
import Img3 from '../assets/images/image3.jpeg'
import Img4 from '../assets/images/image4.jpeg'
import Img5 from '../assets/images/image5.jpeg'

const IconWrapper = styled.img`
  cursor: pointer;
`

export const HarmonyIcon = (props: any) => <HarmonyImg {...props} />
const Icon = (props: any) => <IconWrapper {...props} />

export default Icon
