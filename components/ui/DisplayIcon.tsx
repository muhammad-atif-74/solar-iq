import { MaterialCommunityIcons } from "@expo/vector-icons";

const DisplayIcon = ({ name, color="#333", size= 24 }: { name: string, size?: number, color?: string }) => {
    return (
        <MaterialCommunityIcons
            name={name as any}
            size={size}
            color={color}
        />
    );
};
export default DisplayIcon