import { createBox } from "@shopify/restyle";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Theme } from "../../styles/theme";

const BaseButton = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

export default BaseButton;
