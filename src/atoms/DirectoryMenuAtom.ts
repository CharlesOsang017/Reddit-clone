import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

export interface DirectoryMenuItem{
    displayText: string;
    icon: IconType;
    link: string;
    iconColor: string;
    imageURL?: string;
}

interface  DirectoryMenuState{
    isOpen: boolean;
    selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuItem = {
    displayText: 'Home',
    link: '/',
    icon: TiHome, 
    iconColor: 'black'
}

export const defaultMenuState: DirectoryMenuState={
    isOpen: false,
    selectedMenuItem: defaultMenuItem,
}

export const directoryMenuState = atom<DirectoryMenuState>({
    key: 'directoryMenuState',
    default: defaultMenuState,
})