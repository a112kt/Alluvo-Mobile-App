import React from "react";
import { View, StyleSheet, TextInput, I18nManager } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import { lightColors } from "../../../../../theme";
import MenuElement from "../../../../Components/special/menuElement";
import ArrowDownIcon from "../../../../iconComponent/arrowDownIcon";
import GradientText from "../../../../Components/GradientText";

interface SearchBarProps {
    searchText: string;
    onSearchTextChange: (text: string) => void;
    searchCategory: string;
    onCategoryChange: (category: string) => void;
    showBack?: boolean;
    onBack?: () => void;
}

const SearchBar = React.memo(function SearchBar({ searchText, onSearchTextChange, searchCategory, onCategoryChange, showBack, onBack }: SearchBarProps) {

    const [visible, setVisible] = React.useState(false);
    const [anchorPos, setAnchorPos] = React.useState({ x: 0, y: 0, width: 0, height: 0 });
    const anchorRef = React.useRef<View>(null);

    const openMenu = () => {
        if (anchorRef.current) {
            anchorRef.current.measureInWindow((x, y, width, height) => {
                setAnchorPos({ x, y, width, height });
                setVisible(true);
            });
        }
    };
    const closeMenu = () => setVisible(false);

    const arrCats = ['All', 'Shoes', 'Clothes', 'Accessories'];
    if (searchCategory && !arrCats.includes(searchCategory)) {
        arrCats.push(searchCategory);
    }

    return (
        <View style={styles.container}>
<View style={[styles.searchBarInner, { backgroundColor: "#F3F4F6" }]}> 
                <View style={styles.searchIconWrapper}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill={lightColors.iconGray}/>
                    </Svg>
                </View>
                <TextInput
                    placeholder="Search products..."
                    placeholderTextColor={lightColors.inputPlaceholder}
                    value={searchText}
                    onChangeText={onSearchTextChange}
                    style={[styles.input, { color: lightColors.textTitle }]}
                />
                <TouchableRipple
                    ref={anchorRef}
                    onPress={openMenu}
                    rippleColor={"#f6f3ecaa"}
                    style={[styles.menuAnchorButton, { borderLeftColor: "#E5E7EB" }]}
                >
                    <View style={styles.menuAnchor}>
                        <GradientText
                            text={searchCategory}
                            textStyle={styles.categoryText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        />
                        <ArrowDownIcon />
                    </View>
                </TouchableRipple>
                <MenuElement
                    options={arrCats}
                    getter={searchCategory}
                    setter={onCategoryChange}
                    visible={visible}
                    onDismiss={closeMenu}
                    anchorPosition={anchorPos}
                />
            </View>
        </View>
    );
});

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    searchBarInner: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        alignItems: "center",
        borderRadius: 16,
        height: 48,
        paddingHorizontal: 14,
    },
    searchIconWrapper: {
        marginEnd: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: "Inter-Regular",
        padding: 0,
        paddingVertical: 0,
        includeFontPadding: false,
        textAlign: "left",
        writingDirection: "ltr",
    },
    menuAnchorButton: {
        height: 48,
        justifyContent: "center",
        paddingHorizontal: 12,
        borderLeftWidth: 1,
    },
    menuAnchor: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    categoryText: {
        fontFamily: "Inter-Medium",
        fontSize: 13,
        fontWeight: "500",
        color: "#1E1E1E",
        maxWidth: 50,
        overflow: "hidden",
    },
});
