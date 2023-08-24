import useDirectory from "@/hooks/useDirectory";
import { MenuItem, Flex, Icon, Image } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { IconType } from "react-icons";

interface MenuListItemProps {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
}

const MenuListItem: FunctionComponent<MenuListItemProps> = ({
  link,
  imageURL,
  icon,
  iconColor,
  displayText,
}) => {
  const { onSelectMenuItem } = useDirectory();
  return (
    <MenuItem
      width='100%'
      fontSize='10pt'
      _hover={{ bg: "gray.100" }}
      onClick={() => onSelectMenuItem({displayText, link, icon, iconColor, imageURL}) }
    >
      <Flex align='center'>
        {imageURL ? (
          <Image src={imageURL} borderRadius='full' boxSize='18pt' mr={2} />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};

export default MenuListItem;
