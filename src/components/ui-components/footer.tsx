import React from 'react';
import { View, StyleSheet } from 'react-native';

import { OpenUrlButton } from '../other-components/open-url-button';

export const Footer: React.FC = () => (
    <View style={styles.footer}>
        <View style={styles.wrapperFooterText}>
            <OpenUrlButton>Перейти на сайт производителя</OpenUrlButton>
        </View>
    </View>
);

const styles = StyleSheet.create({
    footer: {
        height: `10%`,
        position: `absolute`, bottom: 0,
        width: `100%`,
        backgroundColor: `#6bc4fe`,
        justifyContent: `center`,
        alignItems: `center`
    },
    wrapperFooterText: {
        backgroundColor: `#4da8e7`,
        width: `100%`,
        justifyContent: `center`,
        alignItems: `center`
    }
});