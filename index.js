'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Modal,
    Text,
    TextInput,
    FlatList,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

import styles from './style';

let componentIndex = 0;

const propTypes = {
    children: PropTypes.any,
    data: PropTypes.array,
    onSearchFilterer: PropTypes.func,
    onChangeSearch: PropTypes.func,
    onChange: PropTypes.func,
    onPress: PropTypes.func,
    onModalOpen: PropTypes.func,
    onModalClose: PropTypes.func,
    onCancel: PropTypes.func,
    keyExtractor: PropTypes.func,
    labelExtractor: PropTypes.func,
    componentExtractor: PropTypes.func,
    visible: PropTypes.bool,
    closeOnChange: PropTypes.bool,
    initValue: PropTypes.string,
    listType: PropTypes.oneOf(['SCROLLVIEW', 'FLATLIST']),
    animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    selectStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    selectTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    optionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    optionTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    optionContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    childrenContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    touchableStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    touchableActiveOpacity: PropTypes.number,
    sectionTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    selectedItemTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    cancelContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    cancelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    cancelTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    overlayStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    initValueTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    searchStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    searchTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    cancelText: PropTypes.string,
    searchText: PropTypes.string,
    searchAutoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    supportedOrientations: PropTypes.arrayOf(
        PropTypes.oneOf([
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
        ]),
    ),
    keyboardShouldPersistTaps: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    backdropPressToClose: PropTypes.bool,
    openButtonContainerAccessible: PropTypes.bool,
    listItemAccessible: PropTypes.bool,
    cancelButtonAccessible: PropTypes.bool,
    scrollViewAccessible: PropTypes.bool,
    scrollViewAccessibilityLabel: PropTypes.string,
    cancelButtonAccessibilityLabel: PropTypes.string,
    passThruProps: PropTypes.object,
    selectTextPassThruProps: PropTypes.object,
    optionTextPassThruProps: PropTypes.object,
    cancelTextPassThruProps: PropTypes.object,
    scrollViewPassThruProps: PropTypes.object,
    modalOpenerHitSlop: PropTypes.object,
    customSelector: PropTypes.node,
    selectedKey: PropTypes.any,
    enableShortPress: PropTypes.bool,
    enableLongPress: PropTypes.bool,
    optionsTestIDPrefix: PropTypes.string,
    hideSectionOnSearch: PropTypes.bool,
    caseSensitiveSearch: PropTypes.bool,
    search: PropTypes.bool,
    fullHeight: PropTypes.bool,
    frozenSearch: PropTypes.bool,
    modalTestId: PropTypes.any,
};


const defaultProps = {
    data: [],
    onChange: () => { },
    onPress: () => { },
    onModalOpen: () => { },
    onModalClose: () => { },
    onCancel: () => { },
    searchFilterer: (item) => item.component,
    keyExtractor: (item) => item.key,
    labelExtractor: (item) => item.label,
    componentExtractor: (item) => item.component,
    listType: 'SCROLLVIEW',
    visible: false,
    closeOnChange: true,
    initValue: 'Select me!',
    animationType: 'slide',
    style: {},
    selectStyle: {},
    selectTextStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    optionContainerStyle: {},
    sectionStyle: {},
    childrenContainerStyle: {},
    touchableStyle: {},
    touchableActiveOpacity: 0.2,
    sectionTextStyle: {},
    selectedItemTextStyle: {},
    cancelContainerStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    initValueTextStyle: {},
    cancelText: 'cancel',
    searchText: 'search',
    searchAutoFocus: false,
    disabled: false,
    supportedOrientations: ['portrait', 'landscape'],
    keyboardShouldPersistTaps: 'always',
    backdropPressToClose: false,
    openButtonContainerAccessible: false,
    listItemAccessible: false,
    cancelButtonAccessible: false,
    scrollViewAccessible: false,
    scrollViewAccessibilityLabel: "",
    cancelButtonAccessibilityLabel: "",
    passThruProps: {},
    selectTextPassThruProps: {},
    optionTextPassThruProps: {},
    cancelTextPassThruProps: {},
    scrollViewPassThruProps: {},
    modalOpenerHitSlop: { top: 0, bottom: 0, left: 0, right: 0 },
    customSelector: undefined,
    selectedKey: '',
    enableShortPress: true,
    enableLongPress: false,
    optionsTestIDPrefix: 'default',
    searchStyle: {},
    searchTextStyle: {},
    hideSectionOnSearch: false,
    caseSensitiveSearch: false,
    search: true,
    fullHeight: false,
    frozenSearch: false,
};

export default class ModalSelector extends React.Component {

    constructor(props) {
        super(props);
        let selectedItem = this.validateSelectedKey(props.selectedKey);
        this.state = {
            modalVisible: props.visible,
            selected: selectedItem.label,
            changedItem: selectedItem.key,
            searchData: null,
        };
        this.initialModalHeight = null;
    }

    componentDidUpdate(prevProps) {
        let newState = {};
        let doUpdate = false;
        if (prevProps.initValue !== this.props.initValue) {
            newState.selected = this.props.initValue;
            doUpdate = true;
        }
        if (prevProps.visible !== this.props.visible) {
            newState.modalVisible = this.props.visible;
            doUpdate = true;
        }
        if (prevProps.selectedKey !== this.props.selectedKey || prevProps.data !== this.props.data) {
            let selectedItem = this.validateSelectedKey(this.props.selectedKey);
            newState.selected = selectedItem.label;
            newState.changedItem = selectedItem.key;
            doUpdate = true;
        }
        if (doUpdate) {
            this.setState(newState);
        }
    }

    validateSelectedKey = (key) => {
        let selectedItem = this.props.data.filter((item) => this.props.keyExtractor(item) === key);
        let selectedLabel = selectedItem.length > 0 ? this.props.labelExtractor(selectedItem[0]) : this.props.initValue;
        let selectedKey = selectedItem.length > 0 ? key : undefined;
        return { label: selectedLabel, key: selectedKey }
    }

    onChange = (item) => {
        this.props.onChange(item);
        this.setState({ selected: this.props.labelExtractor(item), changedItem: item }, () => {
            if (this.props.closeOnChange)
                this.close(item);
        });
    }

    getSelectedItem() {
        return this.state.changedItem;
    }

    close = (item) => {
        this.initialModalHeight = null;
        this.props.onModalClose(item);
        this.setState({
            modalVisible: false,
        });
    }
    cancel = () => {
        this.props.onCancel();
        this.close();
    }

    open = (params = {}) => {
        this.props.onPress(this.validateSelectedKey(this.props.selectedKey));

        if (!params.longPress && !this.props.enableShortPress) {
            return;
        }
        if (params.longPress && !this.props.enableLongPress) {
            return;
        }
        this.props.onModalOpen(params);
        this.setState({
            modalVisible: true,
            changedItem: undefined,
            searchData: null,
        });
    }

    renderSection = (section) => {
        const optionComponent = this.props.componentExtractor(section);
        let component = optionComponent || (
            <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{this.props.labelExtractor(section)}</Text>
        );

        return (
            <View key={this.props.keyExtractor(section)} style={[styles.sectionStyle, this.props.sectionStyle]}>
                {component}
            </View>
        );
    }

    renderOption = (option, isLastItem, isFirstItem) => {
        const optionComponent = this.props.componentExtractor(option);
        const optionLabel = this.props.labelExtractor(option);
        const isSelectedItem = optionLabel === this.state.selected;

        let component = optionComponent || (
            <Text style={[styles.optionTextStyle, this.props.optionTextStyle, isSelectedItem && this.props.selectedItemTextStyle]} {...this.props.optionTextPassThruProps}>
                {optionLabel}
            </Text>
        );

        return (
            <TouchableOpacity
                key={this.props.keyExtractor(option)}
                testID={option.testID || this.props.optionsTestIDPrefix + '-' + optionLabel}
                onPress={() => this.onChange(option)}
                activeOpacity={this.props.touchableActiveOpacity}
                accessible={this.props.listItemAccessible}
                accessibilityLabel={option.accessibilityLabel || undefined}
                importantForAccessibility={isFirstItem ? 'yes' : 'no'}
                {...this.props.passThruProps}
                disabled={option.disabled}
            >
                <View style={[styles.optionStyle, this.props.optionStyle, isLastItem && { borderBottomWidth: 0 }]}>
                    {component}
                </View>
            </TouchableOpacity>);
    }

    renderFlatlistOption = (filteredData) => ({ item, index }) => {
        if (item.section) {
            return this.renderSection(item);
        }
        const numItems = filteredData.length;
        return this.renderOption(item, index === (numItems - 1), index === 0);
    }

    onChangeSearch = (text) => {
        const { onChangeSearch } = this.props;
        if (onChangeSearch) {
            onChangeSearch(text);
        }
        this.setState({ searchData: text });
    }



    onSearchFilterer = (data) => {
        const { onSearchFilterer, hideSectionOnSearch, caseSensitiveSearch } = this.props;
        const { searchData } = this.state;
        if (onSearchFilterer) return onSearchFilterer(searchData, data);
        if (!searchData) return data;

        let arr = [...data].reverse();
        let searchDataStr = (searchData || "")

        if (!caseSensitiveSearch) {
            searchDataStr = searchDataStr.toLowerCase();
        }

        let showSectionMatched = false;
        let filtered = arr.filter(item => {

            let labelDataStr = (this.props.labelExtractor(item) || "");
            if (!caseSensitiveSearch) {
                labelDataStr = labelDataStr.toLowerCase();
            }
            let result = labelDataStr.indexOf(searchDataStr) > -1 || !searchDataStr || (item.section && showSectionMatched && !hideSectionOnSearch);
            if (result) {
                showSectionMatched = true;
            }
            if (item.section) {
                showSectionMatched = false;
            }
            return result;
        })
        return filtered.reverse();
    }

    renderOptionList = () => {
        const {
            data,
            listType,
            backdropPressToClose,
            scrollViewPassThruProps,
            overlayStyle,
            optionContainerStyle,
            keyboardShouldPersistTaps,
            scrollViewAccessible,
            scrollViewAccessibilityLabel,
            cancelContainerStyle,
            touchableActiveOpacity,
            cancelButtonAccessible,
            cancelButtonAccessibilityLabel,
            cancelStyle,
            cancelTextStyle,
            cancelText,
            searchText,
            searchAutoFocus,
            search,
            searchStyle,
            searchTextStyle,
            fullHeight,
            frozenSearch,
        } = this.props;

        const filteredData = this.onSearchFilterer(data);

        let options = filteredData.map((item, index) => {
            if (item.section) {
                return this.renderSection(item);
            }
            return this.renderOption(item, index === filteredData.length - 1, index === 0);
        });

        let Overlay = View;
        let overlayProps = {
            style: { flex: 1 },
        };
        // Some RN versions have a bug here, so making the property opt-in works around this problem
        if (backdropPressToClose) {
            Overlay = TouchableWithoutFeedback;
            overlayProps = {
                key: `modalSelector${componentIndex++}`,
                accessible: false,
                onPress: this.close,
            };
        }

        const optionsContainerStyle = { paddingHorizontal: 10 };
        if (scrollViewPassThruProps && scrollViewPassThruProps.horizontal) {
            optionsContainerStyle.flexDirection = 'row';
        }

        return (
            <Overlay {...overlayProps}>
                <View style={[styles.overlayStyle, overlayStyle]}>
                    <View
                        style={[
                            styles.optionContainer,
                            frozenSearch && { height: this.initialModalHeight },
                            fullHeight && { height: "100%" },
                            optionContainerStyle,
                        ]}
                        onLayout={(event) => this.initialModalHeight = this.initialModalHeight || event.nativeEvent.layout.height}
                    >
                        {search &&
                            <View style={[styles.searchStyle, searchStyle]}>
                                <TextInput autoFocus={searchAutoFocus} style={searchTextStyle} placeholder={searchText} onChangeText={this.onChangeSearch} />
                            </View>
                        }

                        {listType === 'FLATLIST' ?
                            <FlatList
                                data={filteredData}
                                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                                accessible={scrollViewAccessible}
                                accessibilityLabel={scrollViewAccessibilityLabel}
                                keyExtractor={this.props.keyExtractor}
                                renderItem={this.renderFlatlistOption(filteredData)}
                            />
                            :
                            <ScrollView
                                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                                accessible={scrollViewAccessible}
                                accessibilityLabel={scrollViewAccessibilityLabel}
                                {...scrollViewPassThruProps}
                            >
                                <View style={optionsContainerStyle}>
                                    {options}
                                </View>
                            </ScrollView>
                        }
                    </View>
                    <View style={[styles.cancelContainer, cancelContainerStyle]}>
                        <TouchableOpacity onPress={this.cancel} activeOpacity={touchableActiveOpacity} accessible={cancelButtonAccessible} accessibilityLabel={cancelButtonAccessibilityLabel}>
                            <View style={[styles.cancelStyle, cancelStyle]}>
                                <Text style={[styles.cancelTextStyle, cancelTextStyle]} {...this.props.cancelTextPassThruProps}>{cancelText}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        );
    }

    renderChildren = () => {

        if (this.props.children) {
            return this.props.children;
        }
        let initSelectStyle = this.props.initValue === this.state.selected ?
            [styles.initValueTextStyle, this.props.initValueTextStyle] : [styles.selectTextStyle, this.props.selectTextStyle];
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={initSelectStyle} {...this.props.selectTextPassThruProps}>{this.state.selected}</Text>
            </View>
        );
    }

    render() {

        const dp = (
            <Modal
                transparent={true}
                ref={element => this.model = element}
                supportedOrientations={this.props.supportedOrientations}
                visible={this.state.modalVisible}
                onRequestClose={this.close}
                testID={this.props.modalTestId}
                animationType={this.props.animationType}
                onDismiss={() => this.state.changedItem && this.props.onChange(this.state.changedItem)}
            >
                {this.renderOptionList()}
            </Modal>
        );

        return (
            <View style={this.props.style} {...this.props.passThruProps}>
                {dp}
                {this.props.customSelector ?
                    this.props.customSelector
                    :
                    <TouchableOpacity
                        hitSlop={this.props.modalOpenerHitSlop}
                        activeOpacity={this.props.touchableActiveOpacity}
                        style={this.props.touchableStyle}
                        onPress={this.open}
                        onLongPress={() => this.open({ longPress: true })}
                        disabled={this.props.disabled}
                        accessible={this.props.openButtonContainerAccessible}
                    >
                        <View style={this.props.childrenContainerStyle} pointerEvents="none">
                            {this.renderChildren()}
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

ModalSelector.propTypes = propTypes;
ModalSelector.defaultProps = defaultProps;
